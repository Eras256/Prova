'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@prova/ui';
import {
  KeyRound,
  Plus,
  Copy,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import { NETWORK } from '@/lib/solana/constants';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'API Keys',
    headline: ['Access the', 'REST API.'],
    desc: ['Generate a ', 'prova_', ' key to query attestations, agents, and webhooks from your own infrastructure. Keys are scoped to your account.'],
    sdkLabel: 'Usage with SDK',
    authTitle: 'Sign in to generate an API key',
    authDesc: 'Use email or wallet — your keys are tied to your account.',
    authBtn: 'Sign in',
    genLabel: 'Generate new key',
    namePlaceholder: 'e.g. production-agent-v2',
    genBtn: 'Generate key',
    generating: 'Generating…',
    copyNow: 'Key generated — copy it now',
    copyWarning: 'This is the only time this key will be shown. Store it securely — Prova never displays full keys again.',
    nameLabel: 'Name',
    scopesLabel: 'Scopes',
    createdLabel: 'Created',
    copyBtn: 'Copy key',
    copied: 'Copied',
    anotherBtn: 'Generate another',
    endpointsLabel: 'API endpoints',
    keyNameLabel: 'Key name (optional)',
  },
  ES: {
    tag: 'API Keys',
    headline: ['Accede a la', 'API REST.'],
    desc: ['Genera una clave ', 'prova_', ' para consultar atestaciones, agentes y webhooks desde tu propia infraestructura. Las claves están vinculadas a tu cuenta.'],
    sdkLabel: 'Uso con SDK',
    authTitle: 'Inicia sesión para generar una API key',
    authDesc: 'Usa email o wallet — tus claves están vinculadas a tu cuenta.',
    authBtn: 'Iniciar sesión',
    genLabel: 'Generar nueva clave',
    namePlaceholder: 'ej. produccion-agente-v2',
    genBtn: 'Generar clave',
    generating: 'Generando…',
    copyNow: 'Clave generada — cópiala ahora',
    copyWarning: 'Esta es la única vez que se mostrará esta clave. Guárdala de forma segura — Prova nunca vuelve a mostrar las claves completas.',
    nameLabel: 'Nombre',
    scopesLabel: 'Permisos',
    createdLabel: 'Creada',
    copyBtn: 'Copiar clave',
    copied: 'Copiada',
    anotherBtn: 'Generar otra',
    endpointsLabel: 'Endpoints de la API',
    keyNameLabel: 'Nombre de clave (opcional)',
  },
  ZH: {
    tag: 'API 密钥',
    headline: ['访问', 'REST API。'],
    desc: ['生成一个 ', 'prova_', ' 密钥，以便从您自己的基础设施查询证明、代理和 webhook。密钥与您的账户绑定。'],
    sdkLabel: '与 SDK 配合使用',
    authTitle: '登录以生成 API 密钥',
    authDesc: '使用邮箱或钱包 — 您的密钥与您的账户绑定。',
    authBtn: '登录',
    genLabel: '生成新密钥',
    namePlaceholder: '例如：生产代理-v2',
    genBtn: '生成密钥',
    generating: '生成中…',
    copyNow: '密钥已生成 — 立即复制',
    copyWarning: '这是密钥唯一显示的时机。请安全保存 — Prova 不再显示完整密钥。',
    nameLabel: '名称',
    scopesLabel: '权限',
    createdLabel: '创建时间',
    copyBtn: '复制密钥',
    copied: '已复制',
    anotherBtn: '再生成一个',
    endpointsLabel: 'API 端点',
    keyNameLabel: '密钥名称（可选）',
  },
};

type IssuedKey = {
  key: string;
  keyPrefix: string;
  name: string;
  organizationId: string;
  scopes: string[];
  createdAt: string;
};

export function ApiKeysClient() {
  const { authenticated, login, getAccessToken } = usePrivy();
  const { lang } = useI18n();
  const t = content[lang];

  const [keyName, setKeyName] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleIssue = async () => {
    setError(null);
    setIssuing(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Could not get access token. Try logging out and back in.');

      const res = await fetch('/api/issue-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: keyName.trim() || 'My API Key' }),
      });

      const json = (await res.json()) as { data?: IssuedKey; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to issue key');

      setIssued(json.data ?? null);
      setKeyName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIssuing(false);
    }
  };

  const copy = async () => {
    if (!issued) return;
    await navigator.clipboard.writeText(issued.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {NETWORK}
            </p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">
                {t.headline[1]}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc[0]}<code className="font-mono text-foreground">{t.desc[1]}</code>{t.desc[2]}
            </p>
          </div>
        </div>

        {/* SDK usage reference */}
        <div className="mt-16 border border-border bg-surface p-6">
          <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">
            {t.sdkLabel}
          </p>
          <pre className="mt-4 overflow-x-auto font-mono text-sm leading-relaxed text-primary/90">
            {`import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_your_key_here',
});

const { data } = await api.listAttestations({ limit: 20 });`}
          </pre>
        </div>

        {/* Auth gate */}
        {!authenticated ? (
          <section className="mt-16 border border-border bg-background p-8 text-center">
            <KeyRound className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1} />
            <p className="mt-4 font-display text-lg uppercase text-foreground">{t.authTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.authDesc}</p>
            <Button onClick={login} className="mt-6 gap-2 font-mono uppercase tracking-wider">
              {t.authBtn}
            </Button>
          </section>
        ) : (
          <div className="mt-16 space-y-10">
            {/* Generate form */}
            {!issued ? (
              <section className="border border-border bg-background p-8">
                <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">
                  {t.genLabel}
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t.keyNameLabel}
                    </label>
                    <input
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      maxLength={64}
                      className="mt-2 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button
                    onClick={handleIssue}
                    disabled={issuing}
                    className="gap-2 font-mono uppercase tracking-wider"
                  >
                    {issuing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t.generating}</>
                    ) : (
                      <><Plus className="h-4 w-4" /> {t.genBtn}</>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </section>
            ) : (
              /* Key reveal (single-use display) */
              <section className="border border-primary/40 bg-primary/4 p-8">
                <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
                  <CheckCircle className="h-4 w-4" /> {t.copyNow}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.copyWarning}</p>

                <div className="mt-6 flex items-center gap-2 border border-border bg-background px-4 py-3">
                  <code className="flex-1 break-all font-mono text-sm text-foreground">
                    {revealed ? issued.key : `${issued.keyPrefix}${'•'.repeat(48)}`}
                  </code>
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => !r)}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={revealed ? 'Hide key' : 'Reveal key'}
                  >
                    {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={copy}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <dl className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-3">
                  <KeyField label={t.nameLabel}>{issued.name}</KeyField>
                  <KeyField label={t.scopesLabel}>{issued.scopes.join(', ')}</KeyField>
                  <KeyField label={t.createdLabel}>
                    {new Date(issued.createdAt).toISOString().slice(0, 10)}
                  </KeyField>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={copy} className="gap-2 font-mono uppercase tracking-wider">
                    {copied ? (
                      <><CheckCircle className="h-4 w-4" /> {t.copied}</>
                    ) : (
                      <><Copy className="h-4 w-4" /> {t.copyBtn}</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setIssued(null); setRevealed(false); }}
                    className="gap-2 font-mono uppercase tracking-wider"
                  >
                    <Plus className="h-4 w-4" /> {t.anotherBtn}
                  </Button>
                </div>
              </section>
            )}

            {/* Quick reference */}
            <section className="border border-border bg-background p-8">
              <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">
                {t.endpointsLabel}
              </p>
              <div className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
                {[
                  ['GET', '/api/v1/attestations', 'List attestations (public)'],
                  ['GET', '/api/v1/attestations/:id', 'Get attestation by tx sig'],
                  ['GET', '/api/v1/agents/:agentId', 'Get agent account'],
                  ['GET', '/api/v1/stats', 'Global stats'],
                  ['POST', '/api/v1/webhooks', 'Register a webhook (key required)'],
                  ['DELETE', '/api/v1/webhooks/:id', 'Remove a webhook (key required)'],
                ].map(([method, path, desc]) => (
                  <div key={path} className="flex items-baseline gap-3">
                    <span
                      className={`shrink-0 font-pixel text-[10px] uppercase ${method === 'GET' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {method}
                    </span>
                    <span className="text-foreground">{path}</span>
                    <span className="hidden text-muted-foreground/60 sm:inline">— {desc}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://prova-api.fly.dev/api/v1/health"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-primary hover:text-foreground"
              >
                https://prova-api.fly.dev
                <ExternalLink className="h-3 w-3" />
              </a>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function KeyField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-background px-4 py-3">
      <dt className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm text-foreground">{children}</dd>
    </div>
  );
}
