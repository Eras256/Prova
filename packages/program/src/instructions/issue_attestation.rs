use anchor_lang::prelude::*;
use crate::errors::ProvaError;
use crate::state::{AgentAccount, BehaviorAttestation, IssueAttestationParams};

pub const MAX_METADATA_URI_LEN: usize = 200;

#[derive(Accounts)]
#[instruction(params: IssueAttestationParams)]
pub struct IssueAttestation<'info> {
    #[account(
        mut,
        seeds = [crate::state::AgentAccount::SEED, agent.operator.as_ref()],
        bump = agent.bump,
        constraint = !agent.revoked @ ProvaError::AgentRevoked,
        constraint = agent.operator == operator.key() @ ProvaError::UnauthorizedOperator
    )]
    pub agent: Account<'info, AgentAccount>,

    #[account(
        init,
        payer = operator,
        space = BehaviorAttestation::LEN,
        seeds = [
            BehaviorAttestation::SEED,
            agent.key().as_ref(),
            &params.action_hash[..8]
        ],
        bump
    )]
    pub attestation: Account<'info, BehaviorAttestation>,

    #[account(mut)]
    pub operator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<IssueAttestation>, params: IssueAttestationParams) -> Result<()> {
    if let Some(ref uri) = params.metadata_uri {
        require!(uri.len() <= MAX_METADATA_URI_LEN, ProvaError::MetadataUriTooLong);
    }

    let clock = Clock::get()?;
    let attestation = &mut ctx.accounts.attestation;
    let agent = &mut ctx.accounts.agent;

    attestation.agent = ctx.accounts.agent.key();
    attestation.action_type = params.action_type;
    attestation.action_hash = params.action_hash;
    attestation.timestamp = clock.unix_timestamp;
    attestation.block_height = clock.slot;
    attestation.privacy_mode = params.privacy_mode;
    attestation.schema_version = 1;
    attestation.signature = params.signature;
    attestation.bump = ctx.bumps.attestation;

    agent.attestation_count = agent.attestation_count.saturating_add(1);

    emit!(AttestationIssued {
        attestation: ctx.accounts.attestation.key(),
        agent: ctx.accounts.agent.key(),
        action_hash: params.action_hash,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct AttestationIssued {
    pub attestation: Pubkey,
    pub agent: Pubkey,
    pub action_hash: [u8; 32],
    pub timestamp: i64,
}
