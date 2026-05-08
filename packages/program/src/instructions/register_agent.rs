use anchor_lang::prelude::*;
use crate::state::{AgentRegistry, AgentAccount};

#[derive(Accounts)]
#[instruction(agent_id: [u8; 32], policy_root: [u8; 32])]
pub struct RegisterAgent<'info> {
    #[account(
        mut,
        seeds = [AgentRegistry::SEED],
        bump = registry.bump
    )]
    pub registry: Account<'info, AgentRegistry>,

    #[account(
        init,
        payer = operator,
        space = AgentAccount::LEN,
        seeds = [AgentAccount::SEED, operator.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, AgentAccount>,

    #[account(mut)]
    pub operator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterAgent>,
    agent_id: [u8; 32],
    policy_root: [u8; 32],
) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let agent = &mut ctx.accounts.agent;
    let clock = Clock::get()?;

    agent.operator = ctx.accounts.operator.key();
    agent.agent_id = agent_id;
    agent.policy_root = policy_root;
    agent.attestation_count = 0;
    agent.created_at = clock.unix_timestamp;
    agent.revoked = false;
    agent.bump = ctx.bumps.agent;

    registry.agent_count = registry.agent_count.saturating_add(1);

    emit!(AgentRegistered {
        agent: ctx.accounts.agent.key(),
        operator: ctx.accounts.operator.key(),
        agent_id,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct AgentRegistered {
    pub agent: Pubkey,
    pub operator: Pubkey,
    pub agent_id: [u8; 32],
    pub timestamp: i64,
}
