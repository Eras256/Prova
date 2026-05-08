use anchor_lang::prelude::*;

#[error_code]
pub enum ProvaError {
    #[msg("Agent has been revoked and cannot issue attestations")]
    AgentRevoked,
    #[msg("Caller is not the operator of this agent")]
    UnauthorizedOperator,
    #[msg("Invalid Ed25519 signature on attestation")]
    InvalidSignature,
    #[msg("Batch size exceeds maximum of 10 attestations")]
    BatchLimitExceeded,
    #[msg("Metadata URI exceeds maximum length of 200 characters")]
    MetadataUriTooLong,
    #[msg("Agent is already registered")]
    AgentAlreadyRegistered,
    #[msg("Registry is not initialized")]
    RegistryNotInitialized,
}
