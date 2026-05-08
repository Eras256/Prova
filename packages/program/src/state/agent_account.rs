use anchor_lang::prelude::*;

#[account]
pub struct AgentAccount {
    pub operator: Pubkey,
    pub agent_id: [u8; 32],
    pub policy_root: [u8; 32],
    pub attestation_count: u64,
    pub created_at: i64,
    pub revoked: bool,
    pub bump: u8,
}

impl AgentAccount {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 8 + 8 + 1 + 1;
    pub const SEED: &'static [u8] = b"prova_agent";
}
