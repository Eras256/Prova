use anchor_lang::prelude::*;
use crate::errors::ProvaError;
use crate::state::AgentAccount;

#[derive(Accounts)]
pub struct UpdatePolicyRoot<'info> {
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
}

pub fn handler(ctx: Context<UpdatePolicyRoot>, new_root: [u8; 32]) -> Result<()> {
    let agent = &mut ctx.accounts.agent;
    agent.policy_root = new_root;
    
    emit!(PolicyRootUpdated {
        agent: agent.key(),
        operator: agent.operator,
        new_root,
        timestamp: Clock::get()?.unix_timestamp,
    });
    
    Ok(())
}

#[event]
pub struct PolicyRootUpdated {
    pub agent: Pubkey,
    pub operator: Pubkey,
    pub new_root: [u8; 32],
    pub timestamp: i64,
}
