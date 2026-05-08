use thiserror::Error;

#[derive(Debug, Error)]
pub enum ProvaError {
    #[error("Agent not found: {0}")]
    AgentNotFound(String),
    #[error("Agent has been revoked: {0}")]
    AgentRevoked(String),
    #[error("Attestation not found: {0}")]
    AttestationNotFound(String),
    #[error("Invalid cryptographic signature")]
    InvalidSignature,
    #[error("Batch size exceeds limit of {0}")]
    BatchLimitExceeded(usize),
    #[error("Unauthorized: {0}")]
    Unauthorized(String),
    #[error("RPC error: {0}")]
    RpcError(String),
    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}
