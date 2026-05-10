import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const posts = {
  'why-attestations': {
    title: 'Why the Agentic Economy Needs Behavior Attestations',
    date: '2026-05-08',
    category: 'Industry',
    readTime: '6 min read',
    content: [
      {
        type: 'p' as const,
        text: 'The agentic economy is here. Autonomous agents are executing DeFi swaps, filing support tickets, auditing smart contracts, and managing multi-step workflows — all without a human in the loop. By mid-2026, there are estimated to be over 2 million AI agents running on public blockchains, moving real value.',
      },
      {
        type: 'h2' as const,
        text: 'The accountability gap',
      },
      {
        type: 'p' as const,
        text: "When an agent executes a swap at the wrong price, or a tool call leaks sensitive data, or an autonomous decision causes financial harm — who is responsible? The answer today is: nobody knows, because there's no tamper-proof record of what happened.",
      },
      {
        type: 'p' as const,
        text: "Operators keep internal logs, but those logs are controlled by the operator. They can be modified, deleted, or never created in the first place. A user who was harmed by an agent's action has no independent forensic evidence — only the operator's word.",
      },
      {
        type: 'h2' as const,
        text: 'What attestations change',
      },
      {
        type: 'p' as const,
        text: 'Behavior attestations flip this. Every action an agent takes — a transaction, a decision, a tool call — gets wrapped in a cryptographic receipt that is written to the blockchain. The receipt is signed by the agent\'s Ed25519 keypair, anchored to a specific slot, and verifiable by anyone with the PDA address.',
      },
      {
        type: 'p' as const,
        text: 'This creates an immutable audit trail that nobody — not the operator, not Prova, not even the agent itself — can alter after the fact. It\'s the forensic layer the agentic economy has been missing.',
      },
      {
        type: 'h2' as const,
        text: 'Built on Solana Attestation Service',
      },
      {
        type: 'p' as const,
        text: 'Prova is built on top of the Solana Attestation Service (SAS), the Foundation-backed standard for on-chain attestations. This means your attestations are not tied to Prova\'s infrastructure — they live on Solana forever, even if Prova shuts down tomorrow.',
      },
      {
        type: 'p' as const,
        text: 'The cost is sub-cent per receipt. The latency is sub-second. There\'s no excuse not to attest every action.',
      },
    ],
  },
  'sas-deep-dive': {
    title: 'Building on Solana Attestation Service: A Technical Deep-Dive',
    date: '2026-05-05',
    category: 'Engineering',
    readTime: '10 min read',
    content: [
      {
        type: 'p' as const,
        text: "Solana Attestation Service (SAS) is a Solana Foundation initiative to standardize the way identity claims and verifiable credentials are anchored on-chain. In this post we'll walk through how Prova's Anchor program wraps SAS primitives to create behavior-specific attestations for AI agents.",
      },
      {
        type: 'h2' as const,
        text: 'The core primitive: BehaviorAttestation',
      },
      {
        type: 'p' as const,
        text: 'The Prova program stores each attestation as a PDA (Program Derived Address) using the instruction discriminator as the seed. Each account holds: the agent\'s public key, the Ed25519 signature of the action hash, the action type (transaction, decision, toolCall, etc.), and a timestamp.',
      },
      {
        type: 'code' as const,
        text: `pub struct BehaviorAttestation {
    pub agent: Pubkey,        // AgentAccount PDA
    pub agent_id: [u8; 32],   // Ed25519 pubkey of agent keypair
    pub action_type: ActionType,
    pub action_hash: [u8; 32],
    pub privacy_mode: bool,
    pub timestamp: i64,
    pub ed25519_signature: [u8; 64],
    pub schema_version: u64,
    pub bump: u8,
}`,
      },
      {
        type: 'h2' as const,
        text: 'Ed25519 pre-verification',
      },
      {
        type: 'p' as const,
        text: 'The critical security property is that the Solana runtime verifies the Ed25519 signature in the same transaction. We use the native Ed25519 program instruction as a pre-verify: the agent signs the action_hash off-chain, and the record_attestation instruction checks that the signature was verified by the runtime before writing the account.',
      },
      {
        type: 'p' as const,
        text: 'This means you cannot fake an attestation — the agent\'s private key must have actually signed the action. The operator wallet pays the transaction fee but cannot forge the agent\'s signature.',
      },
      {
        type: 'h2' as const,
        text: 'The indexer pipeline',
      },
      {
        type: 'p' as const,
        text: 'On-chain verification is great but querying Solana account data in real-time is expensive. The Prova indexer listens to program logs via Helius, decodes the AttestationIssued events, and writes them to Postgres. This gives you fast, filterable REST API access without touching the RPC on every query.',
      },
    ],
  },
  'metacomp-kya': {
    title: 'MetaComp KYA Framework: What AI Agent Operators Need to Know',
    date: '2026-05-01',
    category: 'Compliance',
    readTime: '8 min read',
    content: [
      {
        type: 'p' as const,
        text: "The MetaComp KYA (Know Your Agent) framework is an emerging compliance standard for operators deploying autonomous AI agents in financial contexts. In 2026, regulators in the EU, Singapore, and several US states have begun referencing KYA requirements in draft AI liability frameworks.",
      },
      {
        type: 'h2' as const,
        text: 'What KYA requires',
      },
      {
        type: 'p' as const,
        text: 'KYA has four core requirements: (1) Agent identity — each agent must have a verifiable, non-repudiable identity. (2) Action logging — every significant action must be logged in a tamper-evident system. (3) Audit access — regulators and auditors must be able to independently verify action logs. (4) Revocation — operators must be able to revoke compromised agents and prove the revocation.',
      },
      {
        type: 'h2' as const,
        text: 'How Prova maps to KYA',
      },
      {
        type: 'p' as const,
        text: 'Prova satisfies all four requirements out of the box. Agent identity is the Ed25519 keypair registered on-chain. Action logging is the BehaviorAttestation account written per action. Audit access is the public Explorer — any auditor with a PDA address can verify independently. Revocation is the revoke_agent instruction that marks the AgentAccount as revoked on-chain.',
      },
      {
        type: 'h2' as const,
        text: 'Privacy mode for sensitive actions',
      },
      {
        type: 'p' as const,
        text: "For actions where the payload is sensitive (medical decisions, private financial data), Prova's Vanish Core privacy mode stores only the action hash on-chain. The underlying action payload stays off-chain under the operator's control. Auditors can verify that an action occurred at a specific time without seeing the content — selective disclosure without zero-knowledge overhead.",
      },
      {
        type: 'h2' as const,
        text: 'Getting started',
      },
      {
        type: 'p' as const,
        text: 'For operators subject to KYA requirements, Prova offers Enterprise plans with signed SLA, DPA/MSA support, and dedicated compliance onboarding. Contact us at neuralsol7@gmail.com to schedule a compliance review.',
      },
    ],
  },
};

type SlugKey = keyof typeof posts;

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug as SlugKey];
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} — Prova Blog`,
    description: post.content[0]?.type === 'p' ? post.content[0].text.slice(0, 160) : '',
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug as SlugKey];
  if (!post) notFound();

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Blog
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-[11px] uppercase tracking-wider text-primary">{post.category}</span>
            <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
            <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl uppercase leading-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
        </div>

        <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {post.content.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="mt-10 font-display text-xl uppercase text-foreground">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'code') {
              return (
                <div key={i} className="overflow-x-auto border border-border bg-surface p-5">
                  <pre className="font-mono text-xs leading-relaxed text-primary/90">{block.text}</pre>
                </div>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">Continue reading</p>
          <Link href="/blog" className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-primary hover:underline">
            ← All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
