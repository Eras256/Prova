use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::ed25519_instruction;

fn main() {
    let kp = Keypair::new();
    let msg = b"hello";
    let sig = kp.sign_message(msg);
    let ix = ed25519_instruction::new_ed25519_instruction_with_signature(
        msg,
        &sig.into(),
        &kp.pubkey().to_bytes(),
    );
    println!("success");
}
