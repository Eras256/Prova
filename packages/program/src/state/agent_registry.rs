use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct AgentRegistry {
    pub authority: Pubkey,
    pub agent_count: u64,
    pub bump: u8,
}

impl AgentRegistry {
    pub const LEN: usize = 8 + 32 + 8 + 1;
    pub const SEED: &'static [u8] = b"prova_registry";
}
