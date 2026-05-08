use anchor_lang::prelude::*;
use crate::state::AgentRegistry;

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = AgentRegistry::LEN,
        seeds = [AgentRegistry::SEED],
        bump
    )]
    pub registry: Account<'info, AgentRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeRegistry>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    registry.authority = ctx.accounts.authority.key();
    registry.agent_count = 0;
    registry.bump = ctx.bumps.registry;
    Ok(())
}
