import { describe, it, expect } from 'vitest';
import { Keypair, PublicKey } from '@solana/web3.js';
import { ProvaClient } from '../client';
import { PROVA_PROGRAM_ID } from '../core';

// Usa un keypair determinista para tests reproducibles
const TEST_AGENT = Keypair.fromSeed(Buffer.alloc(32, 0x01));
const TEST_OPERATOR = Keypair.fromSeed(Buffer.alloc(32, 0x02));
const RPC_URL = 'https://api.devnet.solana.com';

describe('ProvaClient', () => {
  describe('constructor', () => {
    it('creates client with default programId', () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      expect(client).toBeInstanceOf(ProvaClient);
    });

    it('creates client with custom programId', () => {
      const client = new ProvaClient({
        rpcUrl: RPC_URL,
        agentKeypair: TEST_AGENT,
        programId: PROVA_PROGRAM_ID,
      });
      expect(client).toBeInstanceOf(ProvaClient);
    });
  });

  describe('deriveAgentPda()', () => {
    it('derives a valid PDA for an operator', () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const [pda, bump] = client.deriveAgentPda(TEST_OPERATOR.publicKey);
      expect(pda).toBeInstanceOf(PublicKey);
      expect(bump).toBeGreaterThanOrEqual(0);
      expect(bump).toBeLessThanOrEqual(255);
    });

    it('is deterministic — same operator always gives same PDA', () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const [pda1] = client.deriveAgentPda(TEST_OPERATOR.publicKey);
      const [pda2] = client.deriveAgentPda(TEST_OPERATOR.publicKey);
      expect(pda1.toBase58()).toBe(pda2.toBase58());
    });

    it('different operators produce different PDAs', () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const other = Keypair.fromSeed(Buffer.alloc(32, 0x03));
      const [pda1] = client.deriveAgentPda(TEST_OPERATOR.publicKey);
      const [pda2] = client.deriveAgentPda(other.publicKey);
      expect(pda1.toBase58()).not.toBe(pda2.toBase58());
    });

    it('PDA is off the Ed25519 curve (valid PDA)', () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const [pda] = client.deriveAgentPda(TEST_OPERATOR.publicKey);
      expect(PublicKey.isOnCurve(pda.toBytes())).toBe(false);
    });
  });

  describe('static hashAction()', () => {
    it('returns a 32-byte Uint8Array', async () => {
      const hash = await ProvaClient.hashAction('test action');
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });

    it('is deterministic — same input gives same hash', async () => {
      const h1 = await ProvaClient.hashAction('swap 100 USDC');
      const h2 = await ProvaClient.hashAction('swap 100 USDC');
      expect(Buffer.from(h1).equals(Buffer.from(h2))).toBe(true);
    });

    it('different inputs give different hashes', async () => {
      const h1 = await ProvaClient.hashAction('action A');
      const h2 = await ProvaClient.hashAction('action B');
      expect(Buffer.from(h1).equals(Buffer.from(h2))).toBe(false);
    });

    it('handles empty string', async () => {
      const hash = await ProvaClient.hashAction('');
      expect(hash).toHaveLength(32);
    });

    it('handles unicode / emoji', async () => {
      const hash = await ProvaClient.hashAction('swap 100 USDC → SOL 🚀');
      expect(hash).toHaveLength(32);
    });

    it('is sha-256 (known test vector)', async () => {
      // sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
      const hash = await ProvaClient.hashAction('hello');
      const hex = Buffer.from(hash).toString('hex');
      expect(hex).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });
  });

  describe('input validation in attest()', () => {
    it('throws if actionHash is not 32 bytes', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const bad = new Uint8Array(16); // wrong size
      await expect(
        client.attest({ operatorKeypair: TEST_OPERATOR, actionHash: bad })
      ).rejects.toThrow('32 bytes');
    });
  });

  describe('input validation in batchAttest()', () => {
    it('throws if attestations array is empty', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      await expect(
        client.batchAttest({ operatorKeypair: TEST_OPERATOR, attestations: [] })
      ).rejects.toThrow('empty');
    });

    it('throws if batch exceeds MAX_BATCH_ATTESTATIONS (100)', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      const tooMany = Array.from({ length: 101 }, () => ({ actionHash: new Uint8Array(32) }));
      await expect(
        client.batchAttest({ operatorKeypair: TEST_OPERATOR, attestations: tooMany })
      ).rejects.toThrow();
    });

    it('throws if any actionHash is wrong size', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      await expect(
        client.batchAttest({
          operatorKeypair: TEST_OPERATOR,
          attestations: [{ actionHash: new Uint8Array(16) }],
        })
      ).rejects.toThrow('32 bytes');
    });
  });

  describe('input validation in registerAgent()', () => {
    it('throws if policyRoot is not 32 bytes', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      await expect(
        client.registerAgent({
          operatorKeypair: TEST_OPERATOR,
          policyRoot: new Uint8Array(16),
        })
      ).rejects.toThrow('32 bytes');
    });
  });

  describe('input validation in updatePolicyRoot()', () => {
    it('throws if newRoot is not 32 bytes', async () => {
      const client = new ProvaClient({ rpcUrl: RPC_URL, agentKeypair: TEST_AGENT });
      await expect(
        client.updatePolicyRoot({
          operatorKeypair: TEST_OPERATOR,
          newRoot: new Uint8Array(16),
        })
      ).rejects.toThrow('32 bytes');
    });
  });
});
