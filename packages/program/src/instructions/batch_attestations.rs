use anchor_lang::prelude::*;
use crate::errors::ProvaError;
use crate::state::{AgentAccount, AttestationInput};

pub const MAX_BATCH: usize = 10;

#[derive(Accounts)]
pub struct BatchAttestations<'info> {
    #[account(
        mut,
        seeds = [AgentAccount::SEED, agent.operator.as_ref()],
        bump = agent.bump,
        constraint = !agent.revoked @ ProvaError::AgentRevoked,
        constraint = agent.operator == operator.key() @ ProvaError::UnauthorizedOperator
    )]
    pub agent: Account<'info, AgentAccount>,

    #[account(mut)]
    pub operator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BatchAttestations>, attestations: Vec<AttestationInput>) -> Result<()> {
    require!(attestations.len() <= MAX_BATCH, ProvaError::BatchLimitExceeded);

    let agent = &mut ctx.accounts.agent;
    agent.attestation_count = agent
        .attestation_count
        .saturating_add(attestations.len() as u64);

    Ok(())
}
