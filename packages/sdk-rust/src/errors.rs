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

    #[error("Transaction error: {0}")]
    TransactionError(String),

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Account deserialization error: {0}")]
    AccountError(String),
}

impl From<solana_client::client_error::ClientError> for ProvaError {
    fn from(e: solana_client::client_error::ClientError) -> Self {
        ProvaError::RpcError(e.to_string())
    }
}

impl From<solana_sdk::signer::SignerError> for ProvaError {
    fn from(e: solana_sdk::signer::SignerError) -> Self {
        ProvaError::TransactionError(e.to_string())
    }
}
