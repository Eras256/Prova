use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("ProvaATTESTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod prova_program {
    use super::*;

    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        instructions::initialize_registry::handler(ctx)
    }

    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_id: [u8; 32],
        policy_root: [u8; 32],
    ) -> Result<()> {
        instructions::register_agent::handler(ctx, agent_id, policy_root)
    }

    pub fn issue_attestation(
        ctx: Context<IssueAttestation>,
        params: IssueAttestationParams,
    ) -> Result<()> {
        instructions::issue_attestation::handler(ctx, params)
    }

    pub fn batch_attestations(
        ctx: Context<BatchAttestations>,
        attestations: Vec<AttestationInput>,
    ) -> Result<()> {
        instructions::batch_attestations::handler(ctx, attestations)
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
