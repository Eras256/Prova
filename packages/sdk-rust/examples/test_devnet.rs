use prova_agent_sdk::{ProvaClient, ProvaConfig, ActionType};
use solana_sdk::signature::{Keypair, Signer};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Testing Prova SDK against Devnet...");
    
    // Create new keypairs
    let operator = Keypair::new();
    let agent = Keypair::new();
    
    println!("Operator pubkey: {}", operator.pubkey());
    println!("Agent keypair pubkey: {}", agent.pubkey());
    
    let client = ProvaClient::new(agent, ProvaConfig::default());
    
    // Request airdrop to operator for fees (will take a few seconds)
    println!("Requesting airdrop...");
    let rpc_client = solana_client::rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let sig = rpc_client.request_airdrop(&operator.pubkey(), 1_000_000_000)?;
    let mut retries = 0;
    while !rpc_client.confirm_transaction(&sig)? {
        tokio::time::sleep(tokio::time::Duration::from_millis(1000)).await;
        retries += 1;
        if retries > 10 {
            return Err("Airdrop failed".into());
        }
    }
    
    println!("Airdrop confirmed. Registering agent...");
    
    let reg = client.register_agent(&operator, None).await?;
    println!("Agent PDA: {}", reg.agent_pda);
    println!("Registration tx: {}", reg.explorer_url);
    
    // Wait for account to be visible
    tokio::time::sleep(tokio::time::Duration::from_millis(2000)).await;
    
    println!("Attesting action...");
    let hash = ProvaClient::hash_action("swap 100 USDC for SOL on Jupiter");
    let att = client.attest(&operator, hash, ActionType::Transaction, false).await?;
    
    println!("Attestation tx: {}", att.explorer_url);
    
    let acc = client.get_agent_account(&operator.pubkey()).await?;
    println!("Attestation count on-chain: {}", acc.attestation_count);
    
    Ok(())
}
