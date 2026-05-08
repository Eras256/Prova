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

    pub operator: Signer<'info>,
}

pub fn handler(ctx: Context<UpdatePolicyRoot>, new_root: [u8; 32]) -> Result<()> {
    ctx.accounts.agent.policy_root = new_root;
    Ok(())
}
