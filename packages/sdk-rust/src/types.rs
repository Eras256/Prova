use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "PascalCase")]
pub enum ActionType {
    Transaction,
    Decision,
    ModelInvocation,
    ToolCall,
    ResourceAccess,
    PolicyCheck,
    Custom,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttestationPayload {
    pub action_type: ActionType,
    pub payload: serde_json::Value,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttestationResult {
    pub id: String,
    pub agent_pda: String,
    pub tx_signature: String,
    pub timestamp: u64,
    pub block_height: u64,
}

#[derive(Debug, Clone)]
pub struct VerifyResult {
    pub valid: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ProvaConfig {
    pub rpc_url: String,
    pub privacy_mode: bool,
    pub schema_version: u8,
}

impl Default for ProvaConfig {
    fn default() -> Self {
        Self {
            rpc_url: "https://api.devnet.solana.com".to_string(),
            privacy_mode: false,
            schema_version: 1,
        }
    }
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
