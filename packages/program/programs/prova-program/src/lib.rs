use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1");

#[program]
pub mod prova_program {
    use super::*;

    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_id: [u8; 32],
        policy_root: [u8; 32],
    ) -> Result<()> {
        instructions::register_agent::handler(ctx, agent_id, policy_root)
    }

    pub fn record_attestations(
        ctx: Context<RecordAttestations>,
        attestations: Vec<AttestationInput>,
    ) -> Result<()> {
        instructions::record_attestations::handler(ctx, attestations)
    }

    pub fn revoke_agent(ctx: Context<RevokeAgent>) -> Result<()> {
        instructions::revoke_agent::handler(ctx)
    }

    pub fn update_policy_root(
        ctx: Context<UpdatePolicyRoot>,
        new_root: [u8; 32],
    ) -> Result<()> {
        instructions::update_policy_root::handler(ctx, new_root)
    }
}
