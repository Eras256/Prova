'use client';

import { useEffect, useMemo, useState } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, type Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from './idl.json';
import { PROGRAM_ID, RPC_URL } from './constants';
import { decodeEventsFromLogs, type DecodedEvent, type AttestationIssued } from './events';

export function useReadOnlyConnection(): Connection {
  return useMemo(() => new Connection(RPC_URL, 'confirmed'), []);
}

export function useProvaProgram(): { program: Program | null; readOnly: boolean } {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) {
      const dummy = {
        publicKey: PublicKey.default,
        signTransaction: async () => {
          throw new Error('Read-only');
        },
        signAllTransactions: async () => {
          throw new Error('Read-only');
        },
      };
      const provider = new AnchorProvider(connection, dummy as never, AnchorProvider.defaultOptions());
      return { program: new Program(idl as Idl, provider), readOnly: true };
    }
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return { program: new Program(idl as Idl, provider), readOnly: false };
  }, [connection, wallet]);
}

// Suscripción en vivo a logs del programa, decodifica AttestationIssued
export function useLiveAttestations(maxItems = 10): {
  attestations: AttestationIssued[];
  total: number;
  connected: boolean;
} {
  const connection = useReadOnlyConnection();
  const [attestations, setAttestations] = useState<AttestationIssued[]>([]);
  const [total, setTotal] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let subId: number | null = null;
    let cancelled = false;

    (async () => {
      try {
        subId = connection.onLogs(
          PROGRAM_ID,
          (logsResult) => {
            if (logsResult.err) return;
            const events = decodeEventsFromLogs(logsResult.logs);
            for (const ev of events) {
              if (ev.name !== 'AttestationIssued') continue;
              setAttestations((prev) => [ev.data, ...prev].slice(0, maxItems));
              setTotal((t) => t + 1);
            }
          },
          'confirmed'
        );
        if (!cancelled) setConnected(true);
      } catch {
        if (!cancelled) setConnected(false);
      }
    })();

    return () => {
      cancelled = true;
      if (subId !== null) connection.removeOnLogsListener(subId).catch(() => {});
    };
  }, [connection, maxItems]);

  return { attestations, total, connected };
}

// Histórico: lee las últimas N transacciones que tocaron el programa y extrae eventos
export function useRecentAttestations(limit = 25): {
  attestations: (AttestationIssued & { txSignature: string; slot: number })[];
  loading: boolean;
  error: string | null;
} {
  const connection = useReadOnlyConnection();
  const [data, setData] = useState<(AttestationIssued & { txSignature: string; slot: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const sigs = await connection.getSignaturesForAddress(PROGRAM_ID, { limit }, 'confirmed');
        const txs = await connection.getTransactions(
          sigs.map((s) => s.signature),
          { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }
        );

        const out: (AttestationIssued & { txSignature: string; slot: number })[] = [];
        txs.forEach((tx, i) => {
          if (!tx?.meta?.logMessages) return;
          const txSig = sigs[i]!.signature;
          const events = decodeEventsFromLogs(tx.meta.logMessages);
          for (const ev of events) {
            if (ev.name !== 'AttestationIssued') continue;
            out.push({ ...ev.data, txSignature: txSig, slot: tx.slot });
          }
        });

        if (!cancelled) setData(out);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [connection, limit]);

  return { attestations: data, loading, error };
}

export function useAttestationCount(): { count: number | null; loading: boolean } {
  const connection = useReadOnlyConnection();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Approximación: cuenta firmas que tocaron el programa (con un límite alto)
        const sigs = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 1000 });
        if (!cancelled) setCount(sigs.length);
      } catch {
        if (!cancelled) setCount(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connection]);

  return { count, loading };
}

// Detalle completo de una transacción del programa: firma, slot, blockTime y eventos decodificados
export type TransactionDetail = {
  txSignature: string;
  slot: number;
  blockTime: number | null;
  status: 'success' | 'error';
  errorMessage: string | null;
  attestations: AttestationIssued[];
  logs: string[];
};

export function useTransactionDetail(signature: string | null): {
  data: TransactionDetail | null;
  loading: boolean;
  error: string | null;
} {
  const connection = useReadOnlyConnection();
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signature) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const tx = await connection.getTransaction(signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0,
        });
        if (cancelled) return;
        if (!tx) {
          setError('Transaction not found on this cluster');
          setData(null);
          return;
        }
        const logs = tx.meta?.logMessages ?? [];
        const events = decodeEventsFromLogs(logs);
        const attestations = events
          .filter((e): e is Extract<DecodedEvent, { name: 'AttestationIssued' }> => e.name === 'AttestationIssued')
          .map((e) => e.data);
        setData({
          txSignature: signature,
          slot: tx.slot,
          blockTime: tx.blockTime ?? null,
          status: tx.meta?.err ? 'error' : 'success',
          errorMessage: tx.meta?.err ? JSON.stringify(tx.meta.err) : null,
          attestations,
          logs,
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load transaction');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [connection, signature]);

  return { data, loading, error };
}

export type AgentAccountData = {
  address: PublicKey;
  operator: PublicKey;
  agentId: Uint8Array;
  policyRoot: Uint8Array;
  attestationCount: number;
  createdAt: number;
  revoked: boolean;
  bump: number;
};

export function useAgentAccount(pubkey: string | null): {
  data: AgentAccountData | null;
  loading: boolean;
  error: string | null;
} {
  const { program } = useProvaProgram();
  const [data, setData] = useState<AgentAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pubkey || !program) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const tryFetch = async (addr: PublicKey): Promise<AgentAccountData | null> => {
        try {
          // Anchor genera namespace dinámico desde IDL — no tipado por Idl genérico
          const accountNs = program.account as unknown as Record<
            string,
            { fetch: (addr: PublicKey) => Promise<unknown> }
          >;
          const raw = (await accountNs.agentAccount!.fetch(addr)) as {
            operator: PublicKey;
            agentId: number[];
            policyRoot: number[];
            attestationCount: { toNumber: () => number };
            createdAt: { toNumber: () => number };
            revoked: boolean;
            bump: number;
          };
          return {
            address: addr,
            operator: raw.operator,
            agentId: new Uint8Array(raw.agentId),
            policyRoot: new Uint8Array(raw.policyRoot),
            attestationCount:
              typeof raw.attestationCount === 'number'
                ? raw.attestationCount
                : raw.attestationCount.toNumber(),
            createdAt:
              typeof raw.createdAt === 'number' ? raw.createdAt : raw.createdAt.toNumber(),
            revoked: raw.revoked,
            bump: raw.bump,
          };
        } catch {
          return null;
        }
      };

      try {
        let pk: PublicKey;
        try {
          pk = new PublicKey(pubkey);
        } catch {
          if (!cancelled) setError('Invalid public key');
          return;
        }
        // Probar como cuenta directa (puede ser ya el PDA)
        let result = await tryFetch(pk);
        // Si falla, asumir que es el operador y derivar el PDA
        if (!result) {
          const seeds = [Buffer.from('prova_agent'), pk.toBuffer()];
          const [pda] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
          result = await tryFetch(pda);
        }
        if (!cancelled) {
          if (result) setData(result);
          else setError('No agent account found for this address');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load agent');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [program, pubkey]);

  return { data, loading, error };
}

// Lista atestaciones emitidas por un agent PDA específico (filtrando por su pubkey en logs).
export function useAgentAttestations(agentPda: PublicKey | null, limit = 25): {
  attestations: (AttestationIssued & { txSignature: string; slot: number })[];
  loading: boolean;
  error: string | null;
} {
  const connection = useReadOnlyConnection();
  const [data, setData] = useState<(AttestationIssued & { txSignature: string; slot: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentPda) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Las atestaciones tocan la PDA del agente (account = mut), así que filtramos por ella.
        const sigs = await connection.getSignaturesForAddress(agentPda, { limit }, 'confirmed');
        const txs = await connection.getTransactions(
          sigs.map((s) => s.signature),
          { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }
        );
        const out: (AttestationIssued & { txSignature: string; slot: number })[] = [];
        txs.forEach((tx, i) => {
          if (!tx?.meta?.logMessages) return;
          const txSig = sigs[i]!.signature;
          const events = decodeEventsFromLogs(tx.meta.logMessages);
          for (const ev of events) {
            if (ev.name !== 'AttestationIssued') continue;
            if (!ev.data.agent.equals(agentPda)) continue;
            out.push({ ...ev.data, txSignature: txSig, slot: tx.slot });
          }
        });
        if (!cancelled) setData(out);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load attestations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [connection, agentPda, limit]);

  return { attestations: data, loading, error };
}

export type { DecodedEvent, AttestationIssued };
