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

    #[account(mut)]
    pub operator: Signer<'info>,
}

pub fn handler(ctx: Context<RevokeAgent>) -> Result<()> {
    let agent = &mut ctx.accounts.agent;
    agent.revoked = true;
    
    emit!(AgentRevokedEvent {
        agent: agent.key(),
        operator: agent.operator,
        timestamp: Clock::get()?.unix_timestamp,
    });
    
    Ok(())
}

#[event]
pub struct AgentRevokedEvent {
    pub agent: Pubkey,
    pub operator: Pubkey,
    pub timestamp: i64,
}
