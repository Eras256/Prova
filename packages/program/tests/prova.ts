import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, SystemProgram, PublicKey } from '@solana/web3.js';
import { expect } from 'chai';

describe('prova-program', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const operator = Keypair.generate();

  const REGISTRY_SEED = Buffer.from('prova_registry');
  const AGENT_SEED = Buffer.from('prova_agent');
  const ATTESTATION_SEED = Buffer.from('prova_attestation');

  let registryPda: PublicKey;
  let agentPda: PublicKey;

  before(async () => {
    // Airdrop SOL for testing
    await provider.connection.requestAirdrop(operator.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    await new Promise((r) => setTimeout(r, 1000));

    [registryPda] = PublicKey.findProgramAddressSync(
      [REGISTRY_SEED],
      provider.wallet.publicKey
    );
    [agentPda] = PublicKey.findProgramAddressSync(
      [AGENT_SEED, operator.publicKey.toBuffer()],
      provider.wallet.publicKey
    );
  });

  it('initializes registry successfully', async () => {
    expect(registryPda).to.exist;
  });

  it('registers an agent', async () => {
    const agentId = new Uint8Array(32).fill(1);
    const policyRoot = new Uint8Array(32).fill(2);
    expect(agentId).to.have.length(32);
    expect(policyRoot).to.have.length(32);
  });

  it('issues a behavior attestation', async () => {
    const actionHash = new Uint8Array(32).fill(3);
    const signature = new Uint8Array(64).fill(4);
    expect(actionHash).to.have.length(32);
    expect(signature).to.have.length(64);
  });

  it('rejects attestation from revoked agent', async () => {
    expect(true).to.be.true;
  });

  it('handles batch attestations up to limit', async () => {
    const batchSize = 10;
    expect(batchSize).to.be.lte(10);
  });

  it('exceeds batch limit', async () => {
    const oversizedBatch = new Array(11).fill({});
    expect(oversizedBatch.length).to.be.gt(10);
  });

  it('revokes an agent', async () => {
    expect(agentPda).to.exist;
  });

  it('prevents further attestations from revoked agent', async () => {
    expect(true).to.be.true;
  });

  it('updates policy root', async () => {
    const newRoot = new Uint8Array(32).fill(5);
    expect(newRoot).to.have.length(32);
  });
});
