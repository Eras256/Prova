'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Keypair } from '@solana/web3.js';
import { Button } from '@prova/ui';
import {
  ArrowRight,
  Wallet,
  Upload,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
  KeyRound,
  Hash,
  EyeOff,
  Eye,
  Inbox,
} from 'lucide-react';
import { useProvaProgram, useAgentAccount } from '@/lib/solana/hooks';
import {
  parseKeypairJson,
  sha256,
  parseHex32,
  bytesToHex,
  issueAttestation,
  ACTION_TYPE_LABELS,
  type ActionTypeName,
} from '@/lib/solana/attestation';
import { parseProgramError } from '@/lib/solana/registration';
import { explorerTxUrl, NETWORK } from '@/lib/solana/constants';
import { shortPubkey } from '@/lib/solana/events';

type HashMode = 'text' | 'hex';
const ACTION_TYPES: ActionTypeName[] = [
  'transaction',
  'decision',
  'modelInvocation',
  'toolCall',
  'resourceAccess',
  'policyCheck',
  'custom',
];

export function IssueAttestation() {
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { program, readOnly } = useProvaProgram();
  const operatorBase58 = wallet.publicKey?.toBase58() ?? null;
  const { data: agent, loading: loadingAgent } = useAgentAccount(operatorBase58);

  const fileRef = useRef<HTMLInputElement>(null);
  const [agentKeypair, setAgentKeypair] = useState<Keypair | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  const [hashMode, setHashMode] = useState<HashMode>('text');
  const [actionInput, setActionInput] = useState('');
  const [actionHash, setActionHash] = useState<Uint8Array | null>(null);
  const [hashError, setHashError] = useState<string | null>(null);

  const [actionType, setActionType] = useState<ActionTypeName>('transaction');
  const [privacyMode, setPrivacyMode] = useState(false);

  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txSignature: string } | null>(null);

  useEffect(() => {
    if (!actionInput.trim()) {
      setActionHash(null);
      setHashError(null);
      return;
    }
    let cancelled = false;
    setHashError(null);
    if (hashMode === 'text') {
      sha256(actionInput).then((h) => {
        if (!cancelled) setActionHash(h);
      });
    } else {
      try {
        setActionHash(parseHex32(actionInput));
      } catch (e) {
        setActionHash(null);
        setHashError(e instanceof Error ? e.message : 'Invalid hex');
      }
    }
    return () => {
      cancelled = true;
    };
  }, [actionInput, hashMode]);

  const handleFile = async (file: File) => {
    setKeyError(null);
    setAgentKeypair(null);
    try {
      const text = await file.text();
      const kp = parseKeypairJson(text);
      // Validar que el keypair pertenece al agent registrado del operador conectado
      if (agent) {
        const expected = bytesToHex(agent.agentId);
        const actual = bytesToHex(kp.publicKey.toBytes());
        if (expected !== actual) {
          throw new Error(
            `This keypair does not match the registered agent. Agent ID is ${expected.slice(0, 8)}… but uploaded key is ${actual.slice(0, 8)}…`
          );
        }
      }
      setAgentKeypair(kp);
    } catch (e) {
      setKeyError(e instanceof Error ? e.message : 'Failed to parse keypair');
    }
  };

  const issue = async () => {
    if (!program || readOnly || !wallet.publicKey || !agentKeypair || !actionHash) return;
    setIssuing(true);
    setError(null);
    setResult(null);
    try {
      const r = await issueAttestation({
        program,
        operator: wallet.publicKey,
        agentKeypair,
        actionHash,
        actionType,
        privacyMode,
      });
      setResult(r);
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setIssuing(false);
    }
  };

  const canIssue =
    !!agentKeypair &&
    !!actionHash &&
    !!agent &&
    !agent.revoked &&
    !readOnly &&
    !issuing &&
    wallet.connected;

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Issue attestation</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">Wrap an action.</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">Get the receipt.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Sign an action hash with your agent keypair, the program verifies the Ed25519 signature against{' '}
              <code className="font-mono text-foreground">agent_id</code>, and the receipt lands as an
              <code className="mx-1 font-mono text-foreground">AttestationIssued</code>event on Solana.
            </p>
          </div>
        </div>

        {/* Pre-checks */}
        {!wallet.connected && (
          <section className="mt-16 border border-border bg-background p-6">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 0 · Connect operator</p>
            <h2 className="mt-2 font-display text-xl uppercase text-foreground">Connect the operator wallet that registered this agent.</h2>
            <Button onClick={() => openWalletModal(true)} className="mt-5 gap-2 font-mono uppercase tracking-wider">
              <Wallet className="h-4 w-4" />
              Connect wallet
            </Button>
          </section>
        )}

        {wallet.connected && loadingAgent && (
          <div className="mt-16 flex items-center gap-3 border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up your registered agent on devnet…
          </div>
        )}

        {wallet.connected && !loadingAgent && !agent && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <Inbox className="h-4 w-4" /> No agent registered for this operator
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              The connected wallet has no <code className="font-mono text-foreground">AgentAccount</code> yet. Register one
              first.
            </p>
            <Button asChild className="mt-5 gap-2 font-mono uppercase tracking-wider">
              <Link href="/app/register">
                Open register flow <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </section>
        )}

        {wallet.connected && agent?.revoked && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <AlertTriangle className="h-4 w-4" /> This agent is revoked
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              The program rejects record_attestations for revoked agents. Switch to a different operator wallet.
            </p>
          </section>
        )}

        {wallet.connected && agent && !agent.revoked && (
          <>
            {/* Agent summary */}
            <dl className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
              <Field label="Operator">
                <span className="break-all font-mono text-xs text-foreground">{wallet.publicKey?.toBase58()}</span>
              </Field>
              <Field label="Agent PDA">
                <Link
                  href={`/explorer/agent/${agent.address.toBase58()}`}
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {agent.address.toBase58()}
                </Link>
              </Field>
              <Field label="Attestations issued">
                <span className="font-display text-2xl uppercase tabular-nums text-foreground">
                  {agent.attestationCount.toLocaleString()}
                </span>
              </Field>
            </dl>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              {/* Step 1: Upload keypair */}
              <section>
                <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 1 · Agent keypair</h2>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                  Upload the keypair you saved at registration.
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Read locally with <code className="font-mono text-foreground">FileReader</code>, never transmitted. Used to
                  sign each <code className="font-mono text-foreground">action_hash</code> off-chain.
                </p>

                <div className="mt-6">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleFile(f);
                    }}
                  />
                  {!agentKeypair ? (
                    <Button
                      onClick={() => fileRef.current?.click()}
                      variant="outline"
                      className="gap-2 font-mono uppercase tracking-wider"
                    >
                      <Upload className="h-4 w-4" />
                      Choose keypair JSON
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 border border-primary/40 bg-primary/[0.04] px-4 py-3">
                        <CheckCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
                        <div className="min-w-0 flex-1">
                          <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">Keypair loaded · matches agent_id</p>
                          <p className="mt-1 break-all font-mono text-xs text-foreground">
                            {agentKeypair.publicKey.toBase58()}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => fileRef.current?.click()}
                        variant="ghost"
                        className="gap-2 font-mono text-xs uppercase tracking-wider"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Replace
                      </Button>
                    </div>
                  )}
                  {keyError && (
                    <p className="mt-3 flex items-start gap-2 border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {keyError}
                    </p>
                  )}
                </div>
              </section>

              {/* Step 2: Action hash */}
              <section className={!agentKeypair ? 'pointer-events-none opacity-40' : ''}>
                <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 2 · Action hash</h2>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                  Describe the action or paste a 32-byte hash.
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  In production this is a deterministic hash of the structured action payload. For testing, type a description
                  and we&apos;ll sha-256 it for you.
                </p>

                <div className="mt-6">
                  <div className="flex gap-1 border border-border bg-background p-1 text-xs uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => setHashMode('text')}
                      className={`flex-1 px-3 py-1.5 font-pixel text-[12px] ${
                        hashMode === 'text' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Describe (sha256)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHashMode('hex')}
                      className={`flex-1 px-3 py-1.5 font-pixel text-[12px] ${
                        hashMode === 'hex' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Raw hex (32 bytes)
                    </button>
                  </div>

                  {hashMode === 'text' ? (
                    <textarea
                      value={actionInput}
                      onChange={(e) => setActionInput(e.target.value)}
                      placeholder="swap 100 USDC for SOL on Jupiter at 14:32 UTC"
                      rows={3}
                      className="mt-3 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  ) : (
                    <input
                      value={actionInput}
                      onChange={(e) => setActionInput(e.target.value)}
                      placeholder="64 hex characters · 0x prefix optional"
                      className="mt-3 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  )}

                  {actionHash && (
                    <p className="mt-3 flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
                      <Hash className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      <span className="break-all">action_hash = {bytesToHex(actionHash)}</span>
                    </p>
                  )}
                  {hashError && (
                    <p className="mt-3 font-mono text-[11px] text-destructive">{hashError}</p>
                  )}
                </div>
              </section>
            </div>

            {/* Step 3: type + privacy + submit */}
            <section className={`mt-16 ${!agentKeypair || !actionHash ? 'pointer-events-none opacity-40' : ''}`}>
              <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 3 · Metadata & submit</h2>
              <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                Tag, sign, send.
              </h3>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12">
                <div>
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">Action type</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ACTION_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActionType(t)}
                        className={`border px-3 py-2 text-left font-pixel text-[11px] uppercase tracking-wider transition-colors ${
                          actionType === t
                            ? 'border-primary bg-primary/[0.06] text-foreground'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {ACTION_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">Privacy mode</p>
                  <button
                    type="button"
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`mt-2 flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors ${
                      privacyMode ? 'border-primary bg-primary/[0.06]' : 'border-border'
                    }`}
                  >
                    {privacyMode ? (
                      <EyeOff className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                    <div className="flex-1">
                      <p className="font-pixel text-[12px] uppercase tracking-wider text-foreground">
                        {privacyMode ? 'Vanish — selective disclosure' : 'Disclosed — full payload visible'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {privacyMode
                          ? 'Hash is on-chain; the underlying action stays off-chain.'
                          : 'Standard receipt — anyone with the hash preimage can verify.'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-6 flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-words">{error}</span>
                </div>
              )}

              {result ? (
                <div className="mt-6 border border-primary/40 bg-primary/[0.04] p-6">
                  <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
                    <CheckCircle className="h-4 w-4" /> Attestation written to Solana {NETWORK}
                  </div>
                  <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
                    <Field label="Tx signature">
                      <a
                        href={explorerTxUrl(result.txSignature)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="break-all font-mono text-xs text-foreground hover:text-primary"
                      >
                        {result.txSignature} <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </Field>
                    <Field label="Action type">
                      <span className="font-pixel text-[11px] uppercase tracking-wider">{ACTION_TYPE_LABELS[actionType]}</span>
                    </Field>
                    <Field label="Action hash">
                      <span className="break-all font-mono text-xs text-foreground">{actionHash && bytesToHex(actionHash)}</span>
                    </Field>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                      <Link href={`/explorer/tx/${result.txSignature}`}>
                        Open receipt <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setResult(null);
                        setActionInput('');
                        setActionHash(null);
                      }}
                      variant="outline"
                      className="gap-2 font-mono uppercase tracking-wider"
                    >
                      Issue another
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={issue}
                  disabled={!canIssue}
                  className="mt-6 gap-2 font-mono uppercase tracking-wider"
                >
                  {issuing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing & broadcasting…
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      Sign with agent · send from operator
                    </>
                  )}
                </Button>
              )}

              {agentKeypair && actionHash && (
                <p className="mt-4 max-w-2xl font-mono text-[11px] text-muted-foreground">
                  Anatomy: 1 Ed25519 pre-verify ix (agent signs <code className="text-foreground">{shortPubkey(agentKeypair.publicKey, 4, 4)}</code>{' '}
                  → action_hash) · 1 record_attestations ix · paid by operator{' '}
                  <code className="text-foreground">{wallet.publicKey && shortPubkey(wallet.publicKey, 4, 4)}</code>.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-background p-6 ${className ?? ''}`}>
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}
