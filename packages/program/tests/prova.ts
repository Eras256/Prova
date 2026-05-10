import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Ed25519Program,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { createHash } from 'crypto';
import { expect } from 'chai';
import nacl from 'tweetnacl';

// El IDL se genera durante `anchor build`. Tipamos como any para no acoplarnos
// al shape generado y mantener el test legible.
const idl: anchor.Idl = require('../target/idl/prova_program.json');

const AGENT_SEED = Buffer.from('prova_agent');

function hash32(input: string): Buffer {
  return createHash('sha256').update(input).digest();
}

function buildEd25519Ix(agent: Keypair, message: Buffer) {
  return Ed25519Program.createInstructionWithPrivateKey({
    privateKey: agent.secretKey,
    message,
  });
}

describe('prova-program', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new Program(idl, provider) as Program;
  const programId = new PublicKey('G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1');

  // Cada test crea operador + agente frescos para evitar colisiones de PDA.
  let operator: Keypair;
  let agent: Keypair;
  let agentPda: PublicKey;

  beforeEach(async () => {
    operator = Keypair.generate();
    agent = Keypair.generate();
    [agentPda] = PublicKey.findProgramAddressSync(
      [AGENT_SEED, operator.publicKey.toBuffer()],
      programId
    );
    const sig = await provider.connection.requestAirdrop(
      operator.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig, 'confirmed');
  });

  describe('registerAgent', () => {
    it('crea AgentAccount con los campos correctos', async () => {
      const agentId = Array.from(agent.publicKey.toBytes());
      const policyRoot = Array.from(new Uint8Array(32).fill(7));

      await program.methods
        .registerAgent(agentId, policyRoot)
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([operator])
        .rpc();

      const account = await (program.account as any).agentAccount.fetch(agentPda);
      expect(account.operator.toBase58()).to.equal(operator.publicKey.toBase58());
      expect(Buffer.from(account.agentId).equals(agent.publicKey.toBuffer())).to.be.true;
      expect(account.attestationCount.toNumber()).to.equal(0);
      expect(account.revoked).to.be.false;
    });

    it('rechaza registro duplicado del mismo operador', async () => {
      const agentId = Array.from(agent.publicKey.toBytes());
      const policy = Array.from(new Uint8Array(32));

      await program.methods
        .registerAgent(agentId, policy)
        .accounts({ agent: agentPda, operator: operator.publicKey, systemProgram: SystemProgram.programId })
        .signers([operator])
        .rpc();

      try {
        await program.methods
          .registerAgent(agentId, policy)
          .accounts({ agent: agentPda, operator: operator.publicKey, systemProgram: SystemProgram.programId })
          .signers([operator])
          .rpc();
        expect.fail('debería haber fallado por cuenta ya inicializada');
      } catch (err: any) {
        expect(String(err)).to.match(/already in use|0x0/i);
      }
    });
  });

  describe('recordAttestations', () => {
    beforeEach(async () => {
      const agentId = Array.from(agent.publicKey.toBytes());
      await program.methods
        .registerAgent(agentId, Array.from(new Uint8Array(32)))
        .accounts({ agent: agentPda, operator: operator.publicKey, systemProgram: SystemProgram.programId })
        .signers([operator])
        .rpc();
    });

    it('registra una atestación con Ed25519 pre-verify ix válida', async () => {
      const actionHash = hash32('swap 100 USDC -> SOL');
      const sig = nacl.sign.detached(actionHash, agent.secretKey);

      const ed25519Ix = buildEd25519Ix(agent, actionHash);
      const recordIx = await program.methods
        .recordAttestations([
          {
            actionType: { transaction: {} },
            actionHash: Array.from(actionHash),
            privacyMode: false,
            signature: Array.from(sig),
          },
        ])
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      const tx = new Transaction().add(ed25519Ix, recordIx);
      await provider.sendAndConfirm(tx, [operator]);

      const account = await (program.account as any).agentAccount.fetch(agentPda);
      expect(account.attestationCount.toNumber()).to.equal(1);
    });

    it('falla si no hay Ed25519 pre-verify ix', async () => {
      const actionHash = hash32('action sin firma');
      const sig = nacl.sign.detached(actionHash, agent.secretKey);

      try {
        await program.methods
          .recordAttestations([
            {
              actionType: { transaction: {} },
              actionHash: Array.from(actionHash),
              privacyMode: false,
              signature: Array.from(sig),
            },
          ])
          .accounts({
            agent: agentPda,
            operator: operator.publicKey,
            instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
          })
          .signers([operator])
          .rpc();
        expect.fail('debería rechazar sin Ed25519 ix previa');
      } catch (err: any) {
        expect(String(err)).to.match(/InvalidSignature/i);
      }
    });

    it('falla si Ed25519 ix usa un pubkey distinto al agent_id', async () => {
      const actionHash = hash32('action con pubkey equivocada');
      const wrongAgent = Keypair.generate();
      const sig = nacl.sign.detached(actionHash, wrongAgent.secretKey);

      const ed25519Ix = buildEd25519Ix(wrongAgent, actionHash);
      const recordIx = await program.methods
        .recordAttestations([
          {
            actionType: { transaction: {} },
            actionHash: Array.from(actionHash),
            privacyMode: false,
            signature: Array.from(sig),
          },
        ])
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      try {
        const tx = new Transaction().add(ed25519Ix, recordIx);
        await provider.sendAndConfirm(tx, [operator]);
        expect.fail('debería rechazar pubkey distinta');
      } catch (err: any) {
        expect(String(err)).to.match(/InvalidSignature/i);
      }
    });

    it('falla si Ed25519 ix firmó un mensaje distinto al action_hash', async () => {
      const actionHash = hash32('hash que enviamos al programa');
      const otherHash = hash32('hash que firmamos en realidad');
      const sig = nacl.sign.detached(otherHash, agent.secretKey);

      const ed25519Ix = buildEd25519Ix(agent, otherHash);
      const recordIx = await program.methods
        .recordAttestations([
          {
            actionType: { transaction: {} },
            actionHash: Array.from(actionHash),
            privacyMode: false,
            signature: Array.from(sig),
          },
        ])
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      try {
        const tx = new Transaction().add(ed25519Ix, recordIx);
        await provider.sendAndConfirm(tx, [operator]);
        expect.fail('debería rechazar mensaje distinto');
      } catch (err: any) {
        expect(String(err)).to.match(/InvalidSignature/i);
      }
    });

    it('rechaza batch vacío', async () => {
      try {
        await program.methods
          .recordAttestations([])
          .accounts({
            agent: agentPda,
            operator: operator.publicKey,
            instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
          })
          .signers([operator])
          .rpc();
        expect.fail('debería rechazar batch vacío');
      } catch (err: any) {
        expect(String(err)).to.match(/EmptyBatch/i);
      }
    });

    it('procesa un batch de 3 atestaciones e incrementa el contador', async () => {
      const hashes = [hash32('action-1'), hash32('action-2'), hash32('action-3')];
      const ed25519Ixs = hashes.map((h) => buildEd25519Ix(agent, h));
      const inputs = hashes.map((h) => ({
        actionType: { toolCall: {} },
        actionHash: Array.from(h),
        privacyMode: false,
        signature: Array.from(nacl.sign.detached(h, agent.secretKey)),
      }));

      const recordIx = await program.methods
        .recordAttestations(inputs)
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      const tx = new Transaction().add(...ed25519Ixs, recordIx);
      await provider.sendAndConfirm(tx, [operator]);

      const account = await (program.account as any).agentAccount.fetch(agentPda);
      expect(account.attestationCount.toNumber()).to.equal(3);
    });
  });

  describe('revokeAgent', () => {
    beforeEach(async () => {
      const agentId = Array.from(agent.publicKey.toBytes());
      await program.methods
        .registerAgent(agentId, Array.from(new Uint8Array(32)))
        .accounts({ agent: agentPda, operator: operator.publicKey, systemProgram: SystemProgram.programId })
        .signers([operator])
        .rpc();
    });

    it('marca el agente como revocado', async () => {
      await program.methods
        .revokeAgent()
        .accounts({ agent: agentPda, operator: operator.publicKey })
        .signers([operator])
        .rpc();

      const account = await (program.account as any).agentAccount.fetch(agentPda);
      expect(account.revoked).to.be.true;
    });

    it('record_attestations falla después de revoke', async () => {
      await program.methods
        .revokeAgent()
        .accounts({ agent: agentPda, operator: operator.publicKey })
        .signers([operator])
        .rpc();

      const actionHash = hash32('post-revoke');
      const sig = nacl.sign.detached(actionHash, agent.secretKey);
      const ed25519Ix = buildEd25519Ix(agent, actionHash);
      const recordIx = await program.methods
        .recordAttestations([
          {
            actionType: { transaction: {} },
            actionHash: Array.from(actionHash),
            privacyMode: false,
            signature: Array.from(sig),
          },
        ])
        .accounts({
          agent: agentPda,
          operator: operator.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .instruction();

      try {
        const tx = new Transaction().add(ed25519Ix, recordIx);
        await provider.sendAndConfirm(tx, [operator]);
        expect.fail('debería fallar tras revoke');
      } catch (err: any) {
        expect(String(err)).to.match(/AgentRevoked/i);
      }
    });
  });

  describe('updatePolicyRoot', () => {
    beforeEach(async () => {
      const agentId = Array.from(agent.publicKey.toBytes());
      await program.methods
        .registerAgent(agentId, Array.from(new Uint8Array(32)))
        .accounts({ agent: agentPda, operator: operator.publicKey, systemProgram: SystemProgram.programId })
        .signers([operator])
        .rpc();
    });

    it('actualiza el policy_root', async () => {
      const newRoot = Array.from(new Uint8Array(32).fill(99));

      await program.methods
        .updatePolicyRoot(newRoot)
        .accounts({ agent: agentPda, operator: operator.publicKey })
        .signers([operator])
        .rpc();

      const account = await (program.account as any).agentAccount.fetch(agentPda);
      expect(Buffer.from(account.policyRoot).equals(Buffer.from(newRoot))).to.be.true;
    });

    it('falla con un operador no autorizado', async () => {
      const intruder = Keypair.generate();
      const sigFund = await provider.connection.requestAirdrop(intruder.publicKey, LAMPORTS_PER_SOL);
      await provider.connection.confirmTransaction(sigFund, 'confirmed');

      try {
        await program.methods
          .updatePolicyRoot(Array.from(new Uint8Array(32).fill(1)))
          .accounts({ agent: agentPda, operator: intruder.publicKey })
          .signers([intruder])
          .rpc();
        expect.fail('debería rechazar operador distinto');
      } catch (err: any) {
        expect(String(err)).to.match(/UnauthorizedOperator|seeds constraint/i);
      }
    });
  });
});
