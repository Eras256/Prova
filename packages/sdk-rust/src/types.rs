use serde::{Deserialize, Serialize};
use solana_sdk::pubkey::Pubkey;

/// Tipos de acción soportados por el programa Prova on-chain.
/// Los índices (0-6) corresponden al enum Anchor del contrato.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "PascalCase")]
#[repr(u8)]
pub enum ActionType {
    Transaction = 0,
    Decision = 1,
    ModelInvocation = 2,
    ToolCall = 3,
    ResourceAccess = 4,
    PolicyCheck = 5,
    Custom = 6,
}

/// Payload de una atestación antes de ser enviada on-chain.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttestationPayload {
    pub action_type: ActionType,
    pub payload: serde_json::Value,
    pub metadata: Option<serde_json::Value>,
}

/// Resultado de una atestación enviada on-chain.
#[derive(Debug, Clone)]
pub struct AttestResult {
    pub tx_signature: String,
    pub explorer_url: String,
}

/// Resultado de registrar un agente on-chain.
#[derive(Debug, Clone)]
pub struct RegisterAgentResult {
    pub tx_signature: String,
    pub agent_pda: Pubkey,
    pub explorer_url: String,
}

/// Cuenta de agente leída on-chain.
#[derive(Debug, Clone)]
pub struct AgentAccount {
    pub address: Pubkey,
    pub operator: Pubkey,
    pub agent_id: [u8; 32],
    pub policy_root: [u8; 32],
    pub attestation_count: u64,
    pub created_at: i64,
    pub revoked: bool,
    pub bump: u8,
}

/// Parámetros para una sola atestación.
#[derive(Debug, Clone)]
pub struct AttestParams {
    pub action_hash: [u8; 32],
    pub action_type: ActionType,
    pub privacy_mode: bool,
}

/// Configuración del cliente Prova.
#[derive(Debug, Clone)]
pub struct ProvaConfig {
    pub rpc_url: String,
    /// Program ID. Default: G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1
    pub program_id: Option<String>,
}

impl Default for ProvaConfig {
    fn default() -> Self {
        Self {
            rpc_url: "https://api.devnet.solana.com".to_string(),
            program_id: None,
        }
    }
}

// Mantenemos compatibilidad con los tipos anteriores
pub type AttestationResult = AttestResult;

#[derive(Debug, Clone)]
pub struct VerifyResult {
    pub valid: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone)]
pub struct HistoryQuery {
    pub agent_id: String,
    pub from_timestamp: Option<u64>,
    pub to_timestamp: Option<u64>,
    pub action_type: Option<ActionType>,
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}
