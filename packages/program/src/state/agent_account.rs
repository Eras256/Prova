use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
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
    pub const LEN: usize = 8 + Self::INIT_SPACE;
    pub const SEED: &'static [u8] = b"prova_agent";
}
