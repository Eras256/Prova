# prova-agent-sdk

Behavior attestation SDK for AI agents on Solana. Wrap any agent action in a cryptographic receipt — 5 lines from `cargo add` to verified on-chain.

## Install

```bash
cargo add prova-agent-sdk
```

## Quick Start

```rust
use prova_agent_sdk::{ProvaClient, ProvaConfig, ActionType};
use solana_sdk::signature::Keypair;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let operator = Keypair::new();
    let agent = Keypair::new();
    let client = ProvaClient::new(agent, ProvaConfig::default());

    // 1. Register agent
    let reg = client.register_agent(&operator, None).await?;
    println!("Agent PDA: {}", reg.agent_pda);

    // 2. Attest an action
    let hash = ProvaClient::hash_action("swap 100 USDC for SOL on Jupiter");
    let att = client.attest(&operator, hash, ActionType::Transaction, false).await?;
    println!("Tx: {}", att.explorer_url);

    // 3. Read agent on-chain
    let account = client.get_agent_account(&operator.pubkey()).await?;
    println!("Attestation count: {}", account.attestation_count);

    Ok(())
}
```

## Features

| Method | Description |
|---|---|
| `register_agent` | Register a new agent PDA on-chain |
| `attest` | Issue a single attestation with Ed25519 pre-verify |
| `batch_attest` | Issue up to 100 attestations in a single tx |
| `revoke_agent` | Permanently revoke an agent |
| `update_policy_root` | Update the agent's policy merkle root |
| `get_agent_account` | Read agent data directly from the blockchain |
| `is_agent_active` | Check if an agent is registered and not revoked |
| `hash_action` | SHA-256 hash a string into a 32-byte action hash |

## Builder

```rust
use prova_agent_sdk::AttestationBuilder;

let payload = AttestationBuilder::transaction("sig_abc123")?;
let payload = AttestationBuilder::tool_call("web_search", serde_json::json!({"query": "solana"}))?;
let payload = AttestationBuilder::model_invocation("gpt-4", "prompt_hash_abc")?;
```

## Program

- **Program ID:** `G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1`
- **Network:** Solana Devnet (default)
- **PDA Seed:** `["prova_agent", operator_pubkey]`

## License

Apache-2.0
