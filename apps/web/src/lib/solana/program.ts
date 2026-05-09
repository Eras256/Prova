import { AnchorProvider, Program, type Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, type Signer } from '@solana/web3.js';
import idl from './idl.json';
import { PROGRAM_ID, RPC_URL } from './constants';

export type ProvaIdl = typeof idl;

export function getReadOnlyProvider(connection?: Connection): AnchorProvider {
  const conn = connection ?? new Connection(RPC_URL, 'confirmed');
  // Wallet vacía para lecturas — no se puede firmar pero sí consultar accounts y eventos
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error('Read-only provider cannot sign');
    },
    signAllTransactions: async () => {
      throw new Error('Read-only provider cannot sign');
    },
  };
  return new AnchorProvider(conn, dummyWallet as never, AnchorProvider.defaultOptions());
}

export function getProgram(provider: AnchorProvider): Program {
  return new Program(idl as Idl, provider);
}

export function getReadOnlyProgram(connection?: Connection): Program {
  return getProgram(getReadOnlyProvider(connection));
}

export { PROGRAM_ID };
export type { Signer };
