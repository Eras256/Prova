'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Keypair, PublicKey } from '@solana/web3.js';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@prova/ui';
import {
  ArrowRight,
  Wallet,
  KeyRound,
  Download,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  ShieldOff,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useProvaProgram, useAgentAccount } from '@/lib/solana/hooks';
import {
  generateAgentKeypair,
  registerAgent,
  revokeAgent,
  downloadKeypair,
  parseProgramError,
} from '@/lib/solana/registration';
import { explorerTxUrl, NETWORK, deriveAgentPda } from '@/lib/solana/constants';
import { shortPubkey } from '@/lib/solana/events';

type Step = 'connect' | 'generate' | 'review' | 'register' | 'success';

export function RegisterAgent() {
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { program, readOnly } = useProvaProgram();

  const { authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w: any) => w.walletClientType === 'privy');

  // We use either standard Solana Wallet or Privy Embedded Wallet
  const activePubkey = wallet.publicKey || (embeddedWallet ? new PublicKey(embeddedWallet.address) : null);
  const isConnected = wallet.connected || authenticated;
  
  const operatorBase58 = activePubkey?.toBase58() ?? null;
  const { data: existingAgent, loading: checkingExisting, error: existingError } = useAgentAccount(
    operatorBase58
  );

  const [agentKeypair, setAgentKeypair] = useState<Keypair | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txSignature: string; agentPda: string } | null>(null);
  const [revokeTx, setRevokeTx] = useState<string | null>(null);

  const step: Step = !isConnected
    ? 'connect'
    : !agentKeypair
      ? 'generate'
      : !downloaded
        ? 'review'
        : result
          ? 'success'
          : 'register';

  const generate = () => {
    setAgentKeypair(generateAgentKeypair());
    setDownloaded(false);
    setResult(null);
    setError(null);
  };

  const download = () => {
    if (!agentKeypair) return;
    downloadKeypair(agentKeypair, `prova-agent-${agentKeypair.publicKey.toBase58().slice(0, 8)}.json`);
    setDownloaded(true);
  };

  const register = async () => {
    setError(null);
    if (!agentKeypair) {
      setError('Generate an agent keypair first (Step 2).');
      return;
    }
    if (!activePubkey) {
      setError('No operator wallet detected. Connect Phantom/Solflare or sign in via Privy.');
      return;
    }
    if (!program || readOnly) {
      setError(
        authenticated
          ? 'Your Privy embedded Solana wallet is not ready to sign. Try logging out and back in to trigger wallet creation, or connect Phantom/Solflare instead.'
          : 'Signing is not available. Connect Phantom or Solflare to continue.'
      );
      return;
    }
    setRegistering(true);
    try {
      const r = await registerAgent({ program, operator: activePubkey, agentKeypair });
      setResult({ txSignature: r.txSignature, agentPda: r.agentPda.toBase58() });
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setRegistering(false);
    }
  };

  const revoke = async () => {
    if (!program || readOnly || !activePubkey) return;
    setRevoking(true);
    setError(null);
    try {
      const r = await revokeAgent({ program, operator: activePubkey });
      setRevokeTx(r.txSignature);
      window.setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setRevoking(false);
    }
  };

  const agentPdaPreview = activePubkey ? deriveAgentPda(activePubkey)[0].toBase58() : null;
  const hasActiveAgent = existingAgent !== null && !existingAgent?.revoked;
  const hasRevokedAgent = existingAgent !== null && existingAgent?.revoked === true;

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">Register agent</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">Three keys</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">in 90 seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Connect your operator wallet, generate a fresh agent keypair, save it, and write the registration on Solana.
              The agent identity is yours — Prova never sees the secret.
            </p>
          </div>
        </div>

        <ol className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          <Stage
            n="01"
            label="Operator wallet"
            active={step === 'connect'}
            done={step !== 'connect'}
            icon={Wallet}
          />
          <Stage
            n="02"
            label="Agent keypair"
            active={step === 'generate' || step === 'review'}
            done={step === 'register' || step === 'success'}
            icon={KeyRound}
          />
          <Stage
            n="03"
            label="On-chain registration"
            active={step === 'register'}
            done={step === 'success'}
            icon={CheckCircle}
          />
        </ol>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <section>
            <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 1 · Operator</h2>
            <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
              Connect the wallet that controls this agent.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              The operator wallet pays for registration and is the only key that can revoke or update the agent later.
            </p>
            <div className="mt-6">
              {wallet.connected && wallet.publicKey ? (
                <div className="flex items-center gap-3 border border-border bg-background px-4 py-3">
                  <span className="h-2 w-2 bg-primary" aria-hidden />
                  <span className="break-all font-mono text-xs text-foreground">{wallet.publicKey.toBase58()}</span>
                </div>
              ) : authenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 ${activePubkey ? 'bg-primary' : 'bg-destructive'}`} aria-hidden />
                      <span className="font-mono text-xs text-foreground">{user.email?.address || 'User'}</span>
                    </div>
                    <span className="bg-primary/10 px-2 py-0.5 font-pixel text-[10px] text-primary">Privy Embedded Wallet</span>
                  </div>
                  {activePubkey ? (
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Solana address: <span className="break-all text-foreground">{activePubkey.toBase58()}</span>
                      {readOnly && (
                        <span className="ml-2 text-destructive">(signer not ready — log out and back in to provision wallet)</span>
                      )}
                    </p>
                  ) : (
                    <p className="font-mono text-[11px] text-destructive">
                      No Solana wallet provisioned for this account yet. Log out and log in again to trigger automatic wallet creation.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => openWalletModal(true)} className="gap-2 font-mono uppercase tracking-wider">
                    <Wallet className="h-4 w-4" />
                    Connect operator wallet
                  </Button>
                  <Button variant="secondary" onClick={login} className="gap-2 font-mono uppercase tracking-wider">
                    Email Login
                  </Button>
                </div>
              )}
              {isConnected && agentPdaPreview && (
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  Agent PDA for this operator:{' '}
                  <Link
                    href={`/explorer/agent/${agentPdaPreview}`}
                    className="text-foreground hover:text-primary"
                  >
                    {shortPubkey(agentPdaPreview, 6, 6)}
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section className={!isConnected || hasActiveAgent ? 'pointer-events-none opacity-40' : ''}>
            <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 2 · Agent identity</h2>
            <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
              Generate a fresh Ed25519 keypair.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              The agent uses this key to sign every action. Generated locally, never transmitted. You must download and
              store it before continuing.
            </p>

            {!agentKeypair ? (
              <Button
                onClick={generate}
                disabled={!isConnected || hasActiveAgent}
                className="mt-6 gap-2 font-mono uppercase tracking-wider"
              >
                <KeyRound className="h-4 w-4" />
                Generate agent keypair
              </Button>
            ) : (
              <div className="mt-6 space-y-4">
                <dl className="border border-border bg-background">
                  <Pair k="Public key (agent_id)">
                    <span className="break-all font-mono text-xs text-foreground">
                      {agentKeypair.publicKey.toBase58()}
                    </span>
                  </Pair>
                  <Pair k="Secret key">
                    <span className="font-mono text-xs text-muted-foreground">
                      {downloaded ? '(saved to your downloads — never shown again)' : '(not shown — download to save)'}
                    </span>
                  </Pair>
                </dl>

                <div className="flex flex-wrap gap-2">
                  {!downloaded ? (
                    <Button onClick={download} className="gap-2 font-mono uppercase tracking-wider">
                      <Download className="h-4 w-4" />
                      Download keypair
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-primary">
                      <CheckCircle className="h-3.5 w-3.5" /> Keypair downloaded
                    </span>
                  )}
                  <Button variant="ghost" onClick={generate} className="gap-2 font-mono uppercase tracking-wider">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                </div>

                <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Save this file now. We do not store it. If you lose it, the agent identity is unrecoverable and you must
                    register a new one.
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Banner: existing agent for this operator */}
        {isConnected && checkingExisting && (
          <div className="mt-16 flex items-center gap-3 border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking devnet for an existing agent under this operator…
          </div>
        )}

        {isConnected && hasActiveAgent && existingAgent && (
          <section className="mt-16 border border-primary/40 bg-primary/4 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
              <CheckCircle className="h-4 w-4" /> Agent already registered
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              This operator wallet is bound to one agent on-chain. The Prova program enforces a 1:1 mapping
              <code className="mx-1 font-mono text-foreground">[b&quot;prova_agent&quot;, operator]</code> so you cannot
              register a second agent without revoking this one first or switching wallets.
            </p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <Pair k="Agent PDA">
                <Link
                  href={`/explorer/agent/${existingAgent.address.toBase58()}`}
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {existingAgent.address.toBase58()}
                </Link>
              </Pair>
              <Pair k="Attestations issued">
                <span className="font-mono">{existingAgent.attestationCount.toLocaleString()}</span>
              </Pair>
              <Pair k="Registered">
                <span className="font-mono text-xs">
                  {new Date(existingAgent.createdAt * 1000).toISOString().replace('T', ' ').slice(0, 19)} UTC
                </span>
              </Pair>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                <Link href={`/explorer/agent/${existingAgent.address.toBase58()}`}>
                  Open agent page <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                onClick={revoke}
                disabled={revoking}
                variant="outline"
                className="gap-2 font-mono uppercase tracking-wider"
              >
                {revoking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Revoking…
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-3.5 w-3.5" /> Revoke this agent
                  </>
                )}
              </Button>
            </div>
            {revokeTx && (
              <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                Revoke tx:{' '}
                <a
                  href={explorerTxUrl(revokeTx)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary hover:underline"
                >
                  {revokeTx.slice(0, 8)}…{revokeTx.slice(-4)} <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            )}
          </section>
        )}

        {isConnected && hasRevokedAgent && existingAgent && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <ShieldOff className="h-4 w-4" /> This operator is burned
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              The agent at this operator&apos;s PDA has been revoked. The PDA still occupies the address and the program
              cannot reuse it. To register a new agent, switch to a different operator wallet.
            </p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <Pair k="Revoked agent">
                <Link
                  href={`/explorer/agent/${existingAgent.address.toBase58()}`}
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {existingAgent.address.toBase58()}
                </Link>
              </Pair>
              <Pair k="Final attestation count">
                <span className="font-mono">{existingAgent.attestationCount.toLocaleString()}</span>
              </Pair>
            </dl>
          </section>
        )}

        {/* Step 3 */}
        <section
          className={`mt-16 ${
            !downloaded || hasActiveAgent || hasRevokedAgent ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">Step 3 · Register on-chain</h2>
          <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
            Write the registration to the Prova program.
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Calls <code className="font-mono text-foreground">register_agent(agent_id, policy_root)</code> with the agent&apos;s
            public key as <code className="font-mono">agent_id</code> and a zero policy root (you can update it later via
            <code className="font-mono"> update_policy_root</code>).
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="wrap-break-word">{error}</span>
            </div>
          )}

          {existingError && !existingAgent && (
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              Pre-check: {existingError}. (Treated as &quot;no agent yet&quot;.)
            </p>
          )}

          {result ? (
            <div className="mt-6 border border-primary/40 bg-primary/4 p-6">
              <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
                <CheckCircle className="h-4 w-4" /> Registered on Solana {NETWORK}
              </div>
              <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
                <Pair k="Agent PDA">
                  <Link
                    href={`/explorer/agent/${result.agentPda}`}
                    className="break-all font-mono text-xs text-foreground hover:text-primary"
                  >
                    {result.agentPda}
                  </Link>
                </Pair>
                <Pair k="Tx signature">
                  {result.txSignature.startsWith('4mock') ? (
                    <Link
                      href={`/explorer/agent/${result.agentPda}`}
                      className="break-all font-mono text-xs text-foreground hover:text-primary"
                    >
                      {result.txSignature} <ExternalLink className="inline h-3 w-3" />
                    </Link>
                  ) : (
                    <a
                      href={explorerTxUrl(result.txSignature)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="break-all font-mono text-xs text-foreground hover:text-primary"
                    >
                      {result.txSignature} <ExternalLink className="inline h-3 w-3" />
                    </a>
                  )}
                </Pair>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                  <Link href={`/explorer/agent/${result.agentPda}`}>
                    Open agent page <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 font-mono uppercase tracking-wider">
                  <Link href="/app/issue">
                    Issue first attestation <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={register}
              disabled={!downloaded || registering || hasActiveAgent || hasRevokedAgent}
              className="mt-6 gap-2 font-mono uppercase tracking-wider"
            >
              {registering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending transaction…
                </>
              ) : (
                <>
                  Register on {NETWORK} <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}

function Stage({
  n,
  label,
  active,
  done,
  icon: Icon,
}: {
  n: string;
  label: string;
  active: boolean;
  done: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className={`flex items-center gap-4 bg-background px-6 py-5 ${active ? 'bg-primary/4' : ''}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center border ${
          done ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
        }`}
      >
        {done ? <CheckCircle className="h-4 w-4" strokeWidth={1.5} /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
      </span>
      <div>
        <p className="font-mono text-[11px] text-muted-foreground">{n}</p>
        <p
          className={`font-pixel text-[12px] uppercase tracking-wider ${
            active ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function Pair({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}
