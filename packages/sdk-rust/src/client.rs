use crate::errors::ProvaError;
use crate::types::{AttestationPayload, AttestationResult, HistoryQuery, ProvaConfig, VerifyResult};
use sha2::{Digest, Sha256};
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer};
use std::sync::Arc;

const PROVA_PROGRAM_ID: &str = "ProvaATTESTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

pub struct ProvaClient {
    keypair: Arc<Keypair>,
    config: ProvaConfig,
}

impl ProvaClient {
    pub fn new(keypair: Keypair, config: ProvaConfig) -> Self {
        Self { keypair: Arc::new(keypair), config }
    }

    pub fn agent_pda(&self) -> Result<Pubkey, ProvaError> {
        let program_id: Pubkey = PROVA_PROGRAM_ID
            .parse()
            .map_err(|_| ProvaError::RpcError("Invalid program ID".into()))?;
        let (pda, _) = Pubkey::find_program_address(
            &[b"prova_agent", self.keypair.pubkey().as_ref()],
            &program_id,
        );
        Ok(pda)
    }

    pub async fn attest(&self, payload: AttestationPayload) -> Result<AttestationResult, ProvaError> {
        let serialized = serde_json::to_string(&payload)?;
        let hash = Self::sha256_hex(&serialized);
        let agent_pda = self.agent_pda()?;
        let ts = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        Ok(AttestationResult {
            id: format!("att_{}", &hash[..16]),
            agent_pda: agent_pda.to_string(),
            tx_signature: format!("tx_{}", &hash[..32]),
            timestamp: ts,
            block_height: 0,
        })
    }

    pub async fn verify(&self, _attestation_id: &str) -> Result<VerifyResult, ProvaError> {
        Ok(VerifyResult { valid: true, error: None })
    }

    pub async fn history(&self, _query: HistoryQuery) -> Result<Vec<AttestationResult>, ProvaError> {
        Ok(vec![])
    }

    fn sha256_hex(data: &str) -> String {
        let mut h = Sha256::new();
        h.update(data.as_bytes());
        hex::encode(h.finalize())
    }
}
