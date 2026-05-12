//! # prova-agent-sdk
//!
//! Behavior attestation SDK for AI agents on Solana.
//! Wrap any agent action in a cryptographic receipt — 5 lines from `cargo add` to verified on-chain.
//!
//! ## Quick Start
//!
//! ```no_run
//! use prova_agent_sdk::{ProvaClient, ProvaConfig, AttestationBuilder, ActionType};
//! use solana_sdk::signature::Keypair;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let operator = Keypair::new();
//!     let agent = Keypair::new();
//!     let client = ProvaClient::new(agent, ProvaConfig::default());
//!
//!     let reg = client.register_agent(&operator, None).await?;
//!     println!("Agent PDA: {}", reg.agent_pda);
//!
//!     let hash = ProvaClient::hash_action("swap 100 USDC for SOL on Jupiter");
//!     let att = client.attest(&operator, hash, ActionType::Transaction, false).await?;
//!     println!("Tx: {}", att.explorer_url);
//!     Ok(())
//! }
//! ```

pub mod builder;
pub mod client;
pub mod errors;
pub mod types;

pub use builder::AttestationBuilder;
pub use client::{ProvaClient, PROVA_PROGRAM_ID, AGENT_SEED, MAX_BATCH_ATTESTATIONS};
pub use errors::ProvaError;
pub use types::{
    ActionType, AgentAccount, AttestParams, AttestResult, AttestationPayload,
    AttestationResult, HistoryQuery, ProvaConfig, RegisterAgentResult, VerifyResult,
};
