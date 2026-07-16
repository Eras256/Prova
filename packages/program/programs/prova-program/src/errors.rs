use anchor_lang::prelude::*;

#[error_code]
pub enum ProvaError {
    #[msg("Agent has been revoked and cannot issue attestations")]
    AgentRevoked,
    #[msg("Caller is not the operator of this agent")]
    UnauthorizedOperator,
    #[msg("Invalid Ed25519 signature or instruction missing")]
    InvalidSignature,
    #[msg("Batch must contain at least one attestation")]
    EmptyBatch,
    #[msg("Batch limit exceeded (max 100)")]
    BatchLimitExceeded,
    #[msg("Invalid Policy Root")]
    InvalidPolicyRoot,
}
