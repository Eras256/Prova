//! Cliente on-chain para el programa Prova en Solana.
//!
//! Envía transacciones reales a devnet/mainnet. Cada método construye,
//! firma y envía la transacción al cluster configurado.
//!
//! # Ejemplo
//! ```no_run
//! use prova_agent_sdk::{ProvaClient, ProvaConfig, AttestationBuilder, ActionType};
//! use solana_sdk::signature::Keypair;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let operator = Keypair::new();
//!     let agent = Keypair::new();
//!     let config = ProvaConfig { rpc_url: "https://api.devnet.solana.com".into(), ..Default::default() };
//!     let client = ProvaClient::new(agent, config);
//!
//!     // Registrar agente
//!     let reg = client.register_agent(&operator, None).await?;
//!     println!("Registered: {}", reg.explorer_url);
//!
//!     // Emitir atestación
//!     let hash = ProvaClient::hash_action("swap 100 USDC for SOL");
//!     let att = client.attest(&operator, hash, ActionType::Transaction, false).await?;
//!     println!("Attested: {}", att.explorer_url);
//!     Ok(())
//! }
//! ```

use crate::errors::ProvaError;
use crate::types::{ActionType, AgentAccount, AttestParams, AttestResult, ProvaConfig, RegisterAgentResult};
use sha2::{Digest, Sha256};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    compute_budget::ComputeBudgetInstruction,
    ed25519_instruction,
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Keypair,
    signer::Signer,
    system_program,
    sysvar,
    transaction::Transaction,
};
use std::str::FromStr;
use std::sync::Arc;

/// Program ID del contrato Prova desplegado en Solana devnet.
pub const PROVA_PROGRAM_ID: &str = "G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1";

/// Seed para derivar la PDA del agente.
pub const AGENT_SEED: &[u8] = b"prova_agent";

/// Límite máximo de atestaciones por batch.
pub const MAX_BATCH_ATTESTATIONS: usize = 100;

/// Discriminadores de instrucciones Anchor (sha256("global:<method_name>")[..8]).
const DISC_REGISTER_AGENT: [u8; 8] = [135, 157, 66, 195, 2, 113, 175, 30];
const DISC_RECORD_ATTESTATIONS: [u8; 8] = [228, 78, 80, 123, 83, 203, 69, 235];
const DISC_REVOKE_AGENT: [u8; 8] = [227, 60, 209, 125, 240, 117, 163, 73];
const DISC_UPDATE_POLICY_ROOT: [u8; 8] = [204, 72, 225, 189, 180, 164, 143, 74];

/// Discriminador de la cuenta AgentAccount en Anchor (sha256("account:AgentAccount")[..8]).
const ACCOUNT_DISCRIMINATOR: [u8; 8] = [241, 119, 69, 140, 233, 9, 112, 50];

pub struct ProvaClient {
    rpc: RpcClient,
    agent_keypair: Arc<Keypair>,
    program_id: Pubkey,
    network: String,
}

impl ProvaClient {
    pub fn new(agent_keypair: Keypair, config: ProvaConfig) -> Self {
        let network = if config.rpc_url.contains("mainnet") {
            "mainnet"
        } else {
            "devnet"
        }
        .to_string();

        let program_id = config
            .program_id
            .as_deref()
            .and_then(|s| Pubkey::from_str(s).ok())
            .unwrap_or_else(|| Pubkey::from_str(PROVA_PROGRAM_ID).unwrap());

        let rpc = RpcClient::new_with_commitment(config.rpc_url, CommitmentConfig::confirmed());

        Self {
            rpc,
            agent_keypair: Arc::new(agent_keypair),
            program_id,
            network,
        }
    }

    // ─── Helpers públicos ─────────────────────────────────────────────────────

    /// Deriva la PDA del agente a partir de la pubkey del operador.
    pub fn derive_agent_pda(&self, operator: &Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[AGENT_SEED, operator.as_ref()], &self.program_id)
    }

    /// Calcula el SHA-256 de un string de acción, devuelve 32 bytes.
    pub fn hash_action(action: &str) -> [u8; 32] {
        let mut h = Sha256::new();
        h.update(action.as_bytes());
        h.finalize().into()
    }

    /// URL del explorador para una firma de transacción.
    pub fn explorer_url(&self, signature: &str) -> String {
        format!(
            "https://explorer.solana.com/tx/{}?cluster={}",
            signature, self.network
        )
    }

    // ─── Instrucciones on-chain ───────────────────────────────────────────────

    /// Registra un nuevo agente on-chain.
    ///
    /// El `operator_keypair` paga la transacción y se convierte en el dueño del agente.
    /// `policy_root` es opcional (32 bytes); si es `None`, se usa un root vacío.
    pub async fn register_agent(
        &self,
        operator_keypair: &Keypair,
        policy_root: Option<[u8; 32]>,
    ) -> Result<RegisterAgentResult, ProvaError> {
        let agent_id: [u8; 32] = self.agent_keypair.pubkey().to_bytes();
        let policy = policy_root.unwrap_or([0u8; 32]);
        let (agent_pda, _bump) = self.derive_agent_pda(&operator_keypair.pubkey());

        // Serializar argumentos Anchor: discriminador + agent_id + policy_root
        let mut data = Vec::with_capacity(8 + 32 + 32);
        data.extend_from_slice(&DISC_REGISTER_AGENT);
        data.extend_from_slice(&agent_id);
        data.extend_from_slice(&policy);

        let ix = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(agent_pda, false),
                AccountMeta::new(operator_keypair.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            data,
        };

        let sig = self
            .send_with_priority(&[ix], operator_keypair, 100_000)
            .await?;

        Ok(RegisterAgentResult {
            explorer_url: self.explorer_url(&sig),
            tx_signature: sig,
            agent_pda,
        })
    }

    /// Emite una sola atestación on-chain.
    pub async fn attest(
        &self,
        operator_keypair: &Keypair,
        action_hash: [u8; 32],
        action_type: ActionType,
        privacy_mode: bool,
    ) -> Result<AttestResult, ProvaError> {
        self.send_attestations(
            operator_keypair,
            &[AttestParams {
                action_hash,
                action_type,
                privacy_mode,
            }],
        )
        .await
    }

    /// Emite un batch de atestaciones on-chain (máximo 100).
    pub async fn batch_attest(
        &self,
        operator_keypair: &Keypair,
        attestations: &[AttestParams],
    ) -> Result<AttestResult, ProvaError> {
        if attestations.is_empty() {
            return Err(ProvaError::InvalidInput(
                "attestations array cannot be empty".into(),
            ));
        }
        if attestations.len() > MAX_BATCH_ATTESTATIONS {
            return Err(ProvaError::BatchLimitExceeded(MAX_BATCH_ATTESTATIONS));
        }
        self.send_attestations(operator_keypair, attestations).await
    }

    /// Revoca un agente on-chain. Una vez revocado, no puede emitir más atestaciones.
    pub async fn revoke_agent(
        &self,
        operator_keypair: &Keypair,
    ) -> Result<AttestResult, ProvaError> {
        let (agent_pda, _) = self.derive_agent_pda(&operator_keypair.pubkey());

        let ix = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(agent_pda, false),
                AccountMeta::new(operator_keypair.pubkey(), true),
            ],
            data: DISC_REVOKE_AGENT.to_vec(),
        };

        let sig = self
            .send_with_priority(&[ix], operator_keypair, 50_000)
            .await?;

        Ok(AttestResult {
            explorer_url: self.explorer_url(&sig),
            tx_signature: sig,
        })
    }

    /// Actualiza el policy root de un agente registrado.
    pub async fn update_policy_root(
        &self,
        operator_keypair: &Keypair,
        new_root: [u8; 32],
    ) -> Result<AttestResult, ProvaError> {
        let (agent_pda, _) = self.derive_agent_pda(&operator_keypair.pubkey());

        let mut data = Vec::with_capacity(8 + 32);
        data.extend_from_slice(&DISC_UPDATE_POLICY_ROOT);
        data.extend_from_slice(&new_root);

        let ix = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(agent_pda, false),
                AccountMeta::new(operator_keypair.pubkey(), true),
            ],
            data,
        };

        let sig = self
            .send_with_priority(&[ix], operator_keypair, 50_000)
            .await?;

        Ok(AttestResult {
            explorer_url: self.explorer_url(&sig),
            tx_signature: sig,
        })
    }

    // ─── Lectura on-chain ─────────────────────────────────────────────────────

    /// Lee la cuenta del agente directamente desde la blockchain.
    pub async fn get_agent_account(
        &self,
        operator: &Pubkey,
    ) -> Result<AgentAccount, ProvaError> {
        let (pda, _) = self.derive_agent_pda(operator);
        let account_data = self
            .rpc
            .get_account_data(&pda)
            .map_err(|e| ProvaError::AgentNotFound(format!("{}: {}", pda, e)))?;

        Self::deserialize_agent_account(&pda, &account_data)
    }

    /// Verifica si un agente está activo (registrado y no revocado).
    pub async fn is_agent_active(&self, operator: &Pubkey) -> bool {
        match self.get_agent_account(operator).await {
            Ok(acc) => !acc.revoked,
            Err(_) => false,
        }
    }

    // ─── Privados ─────────────────────────────────────────────────────────────

    fn deserialize_agent_account(
        pda: &Pubkey,
        data: &[u8],
    ) -> Result<AgentAccount, ProvaError> {
        // Anchor layout: 8 bytes discriminador + campos
        // AgentAccount: operator(32) + agent_id(32) + policy_root(32) + attestation_count(8) + created_at(8) + revoked(1) + bump(1)
        const MIN_LEN: usize = 8 + 32 + 32 + 32 + 8 + 8 + 1 + 1;
        if data.len() < MIN_LEN {
            return Err(ProvaError::AccountError(format!(
                "Account data too short: {} < {}",
                data.len(),
                MIN_LEN
            )));
        }

        // Verificar discriminador
        if data[..8] != ACCOUNT_DISCRIMINATOR {
            return Err(ProvaError::AccountError(
                "Invalid account discriminator".into(),
            ));
        }

        let d = &data[8..];
        let operator = Pubkey::try_from(&d[0..32])
            .map_err(|_| ProvaError::AccountError("Invalid operator pubkey".into()))?;

        let mut agent_id = [0u8; 32];
        agent_id.copy_from_slice(&d[32..64]);

        let mut policy_root = [0u8; 32];
        policy_root.copy_from_slice(&d[64..96]);

        let attestation_count = u64::from_le_bytes(d[96..104].try_into().unwrap());
        let created_at = i64::from_le_bytes(d[104..112].try_into().unwrap());
        let revoked = d[112] != 0;
        let bump = d[113];

        Ok(AgentAccount {
            address: *pda,
            operator,
            agent_id,
            policy_root,
            attestation_count,
            created_at,
            revoked,
            bump,
        })
    }

    /// Construye y envía las instrucciones de atestación con Ed25519 pre-verify.
    async fn send_attestations(
        &self,
        operator_keypair: &Keypair,
        entries: &[AttestParams],
    ) -> Result<AttestResult, ProvaError> {
        let (agent_pda, _) = self.derive_agent_pda(&operator_keypair.pubkey());

        // Firmar cada action_hash con la keypair del agente y crear instrucciones Ed25519
        let mut ed25519_ixs = Vec::with_capacity(entries.len());
        let mut attestation_inputs_data = Vec::new();

        // Serializar Vec<AttestationInput> para Anchor: u32 length prefix + items
        let len_bytes = (entries.len() as u32).to_le_bytes();
        attestation_inputs_data.extend_from_slice(&len_bytes);

        for entry in entries {
            // Firmar el action_hash con la keypair del agente usando solana_sdk
            let sig = self.agent_keypair.sign_message(&entry.action_hash);
            let sig_bytes: [u8; 64] = sig.into();

            // Instrucción Ed25519 de pre-verify usando bytes crudos
            let ed25519_ix = ed25519_instruction::new_ed25519_instruction_with_signature(
                &entry.action_hash,
                &sig_bytes,
                &self.agent_keypair.pubkey().to_bytes(),
            );
            ed25519_ixs.push(ed25519_ix);

            // Serializar AttestationInput para Anchor:
            // action_type: u8 (enum index)
            // action_hash: [u8; 32]
            // privacy_mode: bool (u8)
            // signature: [u8; 64]
            attestation_inputs_data.push(entry.action_type as u8);
            attestation_inputs_data.extend_from_slice(&entry.action_hash);
            attestation_inputs_data.push(entry.privacy_mode as u8);
            attestation_inputs_data.extend_from_slice(&sig_bytes);
        }

        // Construir instrucción principal: discriminador + attestations_data
        let mut ix_data = Vec::with_capacity(8 + attestation_inputs_data.len());
        ix_data.extend_from_slice(&DISC_RECORD_ATTESTATIONS);
        ix_data.extend_from_slice(&attestation_inputs_data);

        let record_ix = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(agent_pda, false),
                AccountMeta::new(operator_keypair.pubkey(), true),
                AccountMeta::new_readonly(sysvar::instructions::id(), false),
            ],
            data: ix_data,
        };

        // Ensamblar transacción: ComputeBudget + Ed25519 pre-verify ixs + record_attestations
        let compute_units = 50_000 + (entries.len() as u32 * 15_000);
        let mut all_ixs = Vec::with_capacity(2 + entries.len() + 1);
        all_ixs.push(ComputeBudgetInstruction::set_compute_unit_limit(compute_units));
        all_ixs.push(ComputeBudgetInstruction::set_compute_unit_price(100_000));
        all_ixs.extend(ed25519_ixs);
        all_ixs.push(record_ix);

        let sig = self
            .send_tx(&all_ixs, operator_keypair)
            .await?;

        Ok(AttestResult {
            explorer_url: self.explorer_url(&sig),
            tx_signature: sig,
        })
    }

    /// Envía una transacción con ComputeBudget de prioridad.
    async fn send_with_priority(
        &self,
        ixs: &[Instruction],
        payer: &Keypair,
        compute_units: u32,
    ) -> Result<String, ProvaError> {
        let mut all_ixs = Vec::with_capacity(2 + ixs.len());
        all_ixs.push(ComputeBudgetInstruction::set_compute_unit_limit(compute_units));
        all_ixs.push(ComputeBudgetInstruction::set_compute_unit_price(100_000));
        all_ixs.extend_from_slice(ixs);
        self.send_tx(&all_ixs, payer).await
    }

    /// Envía una transacción firmada al cluster.
    async fn send_tx(
        &self,
        ixs: &[Instruction],
        payer: &Keypair,
    ) -> Result<String, ProvaError> {
        let blockhash = self.rpc.get_latest_blockhash()?;

        let tx = Transaction::new_signed_with_payer(
            ixs,
            Some(&payer.pubkey()),
            &[payer],
            blockhash,
        );

        let sig = self
            .rpc
            .send_and_confirm_transaction(&tx)
            .map_err(|e| ProvaError::TransactionError(e.to_string()))?;

        Ok(sig.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_action_is_deterministic() {
        let h1 = ProvaClient::hash_action("swap 100 USDC");
        let h2 = ProvaClient::hash_action("swap 100 USDC");
        assert_eq!(h1, h2);
        assert_ne!(h1, [0u8; 32]);
    }

    #[test]
    fn derive_pda_is_consistent() {
        let agent = Keypair::new();
        let config = ProvaConfig::default();
        let client = ProvaClient::new(agent, config);
        let operator = Keypair::new();

        let (pda1, bump1) = client.derive_agent_pda(&operator.pubkey());
        let (pda2, bump2) = client.derive_agent_pda(&operator.pubkey());
        assert_eq!(pda1, pda2);
        assert_eq!(bump1, bump2);
    }

    #[test]
    fn explorer_url_format() {
        let agent = Keypair::new();
        let config = ProvaConfig::default();
        let client = ProvaClient::new(agent, config);
        let url = client.explorer_url("abc123");
        assert!(url.contains("abc123"));
        assert!(url.contains("devnet"));
    }

    #[test]
    fn batch_limit_enforced() {
        let agent = Keypair::new();
        let config = ProvaConfig::default();
        let client = ProvaClient::new(agent, config);
        let entries: Vec<AttestParams> = (0..101)
            .map(|_| AttestParams {
                action_hash: [0u8; 32],
                action_type: ActionType::Transaction,
                privacy_mode: false,
            })
            .collect();
        let operator = Keypair::new();

        let result = tokio::runtime::Runtime::new()
            .unwrap()
            .block_on(client.batch_attest(&operator, &entries));

        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("100"));
    }

    #[test]
    fn deserialize_agent_account_rejects_short_data() {
        let pda = Pubkey::new_unique();
        let data = vec![0u8; 10];
        assert!(ProvaClient::deserialize_agent_account(&pda, &data).is_err());
    }

    #[test]
    fn deserialize_agent_account_rejects_bad_discriminator() {
        let pda = Pubkey::new_unique();
        let data = vec![0u8; 122]; // Suficiente largo pero discriminador incorrecto
        assert!(ProvaClient::deserialize_agent_account(&pda, &data).is_err());
    }
}
