use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions::{load_instruction_at_checked, ID as IX_ID};
use crate::errors::ProvaError;
use crate::state::AgentAccount;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ActionType {
    Transaction,
    Decision,
    ModelInvocation,
    ToolCall,
    ResourceAccess,
    PolicyCheck,
    Custom,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AttestationInput {
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub privacy_mode: bool,
    pub signature: [u8; 64],
}

#[derive(Accounts)]
pub struct RecordAttestations<'info> {
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

    /// CHECK: Instructions sysvar — validated via address constraint
    #[account(address = IX_ID)]
    pub instructions: UncheckedAccount<'info>,
}

// Ed25519 program instruction header layout (single-signature, inline data):
//   [0]      num_signatures
//   [1]      padding
//   [2..4]   signature_offset        (u16 LE) — offset into ix.data for the 64-byte signature
//   [4..6]   signature_instruction_index (u16 LE) — 0xFFFF = current instruction
//   [6..8]   public_key_offset       (u16 LE) — offset into ix.data for the 32-byte pubkey
//   [8..10]  public_key_instruction_index (u16 LE) — must be 0xFFFF
//   [10..12] message_data_offset     (u16 LE) — offset into ix.data for the message
//   [12..14] message_data_size       (u16 LE) — must be 32 (action_hash)
//   [14..16] message_instruction_index (u16 LE) — must be 0xFFFF
//
// Transaction must be built as: [Ed25519_0, ..., Ed25519_N-1, record_attestations]
// so that attestation i corresponds to Ed25519 instruction at index i.
fn verify_ed25519_ix(
    ix: &anchor_lang::solana_program::instruction::Instruction,
    expected_pubkey: &[u8; 32],
    expected_message: &[u8; 32],
) -> Result<()> {
    require_keys_eq!(
        ix.program_id,
        anchor_lang::solana_program::ed25519_program::ID,
        ProvaError::InvalidSignature
    );

    // Minimum header size: 2 (num_sigs + padding) + 14 (one entry) = 16 bytes
    require!(ix.data.len() >= 16, ProvaError::InvalidSignature);

    // Reject cross-instruction references — data must be inline in this instruction
    let pk_ix_index  = u16::from_le_bytes([ix.data[8],  ix.data[9]]);
    let msg_ix_index = u16::from_le_bytes([ix.data[14], ix.data[15]]);
    require!(pk_ix_index == 0xFFFF && msg_ix_index == 0xFFFF, ProvaError::InvalidSignature);

    // Read offsets from header
    let pk_offset  = u16::from_le_bytes([ix.data[6],  ix.data[7]])  as usize;
    let msg_offset = u16::from_le_bytes([ix.data[10], ix.data[11]]) as usize;
    let msg_size   = u16::from_le_bytes([ix.data[12], ix.data[13]]) as usize;

    // Verify pubkey matches agent_id
    require!(
        ix.data.len() >= pk_offset.saturating_add(32),
        ProvaError::InvalidSignature
    );
    require!(
        &ix.data[pk_offset..pk_offset + 32] == expected_pubkey,
        ProvaError::InvalidSignature
    );

    // Verify signed message is exactly this attestation's action_hash
    require!(msg_size == 32, ProvaError::InvalidSignature);
    require!(
        ix.data.len() >= msg_offset.saturating_add(32),
        ProvaError::InvalidSignature
    );
    require!(
        &ix.data[msg_offset..msg_offset + 32] == expected_message,
        ProvaError::InvalidSignature
    );

    Ok(())
}

pub fn handler(ctx: Context<RecordAttestations>, attestations: Vec<AttestationInput>) -> Result<()> {
    require!(!attestations.is_empty(), ProvaError::EmptyBatch);
    require!(attestations.len() <= 100, ProvaError::BatchLimitExceeded);

    let agent = &mut ctx.accounts.agent;
    let ix_sysvar = ctx.accounts.instructions.to_account_info();

    // One Ed25519 pre-verification instruction per attestation, in order
    for (i, att) in attestations.iter().enumerate() {
        let ix = load_instruction_at_checked(i, &ix_sysvar)
            .map_err(|_| ProvaError::InvalidSignature)?;
        verify_ed25519_ix(&ix, &agent.agent_id, &att.action_hash)?;
    }

    let clock = Clock::get()?;

    for att in attestations.iter() {
        emit!(AttestationIssued {
            agent: agent.key(),
            agent_id: agent.agent_id,
            action_type: att.action_type,
            action_hash: att.action_hash,
            privacy_mode: att.privacy_mode,
            timestamp: clock.unix_timestamp,
            signature: att.signature,
        });
    }

    agent.attestation_count = agent.attestation_count.saturating_add(attestations.len() as u64);

    Ok(())
}

#[event]
pub struct AttestationIssued {
    pub agent: Pubkey,
    pub agent_id: [u8; 32],
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub privacy_mode: bool,
    pub timestamp: i64,
    pub signature: [u8; 64],
}
