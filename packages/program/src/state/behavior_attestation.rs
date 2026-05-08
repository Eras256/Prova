use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ActionType {
    Transaction,
    Decision,
    ModelInvocation,
    ToolCall,
    ResourceAccess,
    PolicyCheck,
    Custom,
}

#[account]
pub struct BehaviorAttestation {
    pub agent: Pubkey,
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub timestamp: i64,
    pub block_height: u64,
    pub privacy_mode: bool,
    pub schema_version: u8,
    pub signature: [u8; 64],
    pub bump: u8,
}

impl BehaviorAttestation {
    pub const LEN: usize = 8 + 32 + 1 + 32 + 8 + 8 + 1 + 1 + 64 + 1;
    pub const SEED: &'static [u8] = b"prova_attestation";
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct IssueAttestationParams {
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub metadata_uri: Option<String>,
    pub privacy_mode: bool,
    pub signature: [u8; 64],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AttestationInput {
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub privacy_mode: bool,
    pub signature: [u8; 64],
}
