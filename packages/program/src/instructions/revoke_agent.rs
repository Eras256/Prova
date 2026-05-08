use anchor_lang::prelude::*;
use crate::errors::ProvaError;
use crate::state::AgentAccount;

#[derive(Accounts)]
pub struct RevokeAgent<'info> {
    #[account(
        mut,
        seeds = [AgentAccount::SEED, agent.operator.as_ref()],
        bump = agent.bump,
        constraint = agent.operator == operator.key() @ ProvaError::UnauthorizedOperator
    )]
    pub agent: Account<'info, AgentAccount>,

    pub operator: Signer<'info>,
}

pub fn handler(ctx: Context<RevokeAgent>) -> Result<()> {
    ctx.accounts.agent.revoked = true;

    emit!(AgentRevoked {
        agent: ctx.accounts.agent.key(),
        operator: ctx.accounts.operator.key(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct AgentRevoked {
    pub agent: Pubkey,
    pub operator: Pubkey,
    pub timestamp: i64,
}
