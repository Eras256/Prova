'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Keypair } from '@solana/web3.js';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets as usePrivySolanaWallets } from '@privy-io/react-auth/solana';
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
import { useI18n } from '@/components/i18n-provider';

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

const content = {
  EN: {
    tag: 'Issue attestation',
    headline: ['Wrap an action.', 'Get the receipt.'],
    desc: ['Sign an action hash with your agent keypair, the program verifies the Ed25519 signature against ', 'agent_id', ', and the receipt lands as an ', 'AttestationIssued', ' event on Solana.'],
    step0: { tag: 'Step 0 · Connect operator', title: 'Connect the operator wallet that registered this agent.', cta: 'Connect wallet' },
    loadingAgent: 'Looking up your registered agent on devnet…',
    noAgent: { tag: 'No agent registered for this operator', desc: 'The connected wallet has no AgentAccount yet. Register one first.', cta: 'Open register flow' },
    revoked: { tag: 'This agent is revoked', desc: 'The program rejects record_attestations for revoked agents. Switch to a different operator wallet.' },
    agentSummary: { operator: 'Operator', pda: 'Agent PDA', attestations: 'Attestations issued' },
    step1: { tag: 'Step 1 · Agent keypair', title: 'Upload the keypair you saved at registration.', desc: 'Read locally with FileReader, never transmitted. Used to sign each action_hash off-chain.', cta: 'Choose keypair JSON', success: 'Keypair loaded · matches agent_id', replace: 'Replace' },
    step2: { tag: 'Step 2 · Action hash', title: 'Describe the action or paste a 32-byte hash.', desc: 'In production this is a deterministic hash of the structured action payload. For testing, type a description and we\'ll sha-256 it for you.', btnText: 'Describe (sha256)', btnHex: 'Raw hex (32 bytes)', placeholderText: 'swap 100 USDC for SOL on Jupiter at 14:32 UTC', placeholderHex: '64 hex characters · 0x prefix optional' },
    step3: { tag: 'Step 3 · Metadata & submit', title: 'Tag, sign, send.', actionType: 'Action type', privacyMode: 'Privacy mode', vanishTitle: 'Vanish — selective disclosure', vanishDesc: 'Hash is on-chain; the underlying action stays off-chain.', publicTitle: 'Disclosed — full payload visible', publicDesc: 'Standard receipt — anyone with the hash preimage can verify.' },
    success: { tag: 'Attestation written to Solana', tx: 'Tx signature', type: 'Action type', hash: 'Action hash', open: 'Open receipt', another: 'Issue another' },
    submit: { signing: 'Signing & broadcasting…', sign: 'Sign with agent · send from operator' },
    anatomy: ['Anatomy: 1 Ed25519 pre-verify ix (agent signs ', ' → action_hash) · 1 record_attestations ix · paid by operator '],
    errors: {
      invalidKeypair: 'Failed to parse keypair',
      mismatch: 'This keypair does not match the registered agent. Agent ID is {0}… but uploaded key is {1}…',
      invalidHex: 'Invalid hex'
    }
  },
  ES: {
    tag: 'Emitir atestación',
    headline: ['Envuelve una acción.', 'Obtén el recibo.'],
    desc: ['Firma un hash de acción con el keypair de tu agente, el programa verifica la firma Ed25519 contra el ', 'agent_id', ', y el recibo aterriza como un evento ', 'AttestationIssued', ' en Solana.'],
    step0: { tag: 'Paso 0 · Conectar operador', title: 'Conecta la wallet del operador que registró este agente.', cta: 'Conectar wallet' },
    loadingAgent: 'Buscando tu agente registrado en devnet…',
    noAgent: { tag: 'Ningún agente registrado para este operador', desc: 'La wallet conectada aún no tiene un AgentAccount. Registra uno primero.', cta: 'Abrir flujo de registro' },
    revoked: { tag: 'Este agente está revocado', desc: 'El programa rechaza record_attestations para agentes revocados. Cambia a una wallet de operador diferente.' },
    agentSummary: { operator: 'Operador', pda: 'PDA del Agente', attestations: 'Atestaciones emitidas' },
    step1: { tag: 'Paso 1 · Keypair del Agente', title: 'Sube el keypair que guardaste en el registro.', desc: 'Se lee localmente con FileReader, nunca se transmite. Se usa para firmar cada action_hash fuera de la cadena.', cta: 'Elegir JSON de keypair', success: 'Keypair cargado · coincide con agent_id', replace: 'Reemplazar' },
    step2: { tag: 'Paso 2 · Hash de acción', title: 'Describe la acción o pega un hash de 32 bytes.', desc: 'En producción este es un hash determinista del payload estructurado de la acción. Para pruebas, escribe una descripción y nosotros generaremos el sha-256.', btnText: 'Describir (sha256)', btnHex: 'Hex crudo (32 bytes)', placeholderText: 'intercambiar 100 USDC por SOL en Jupiter a las 14:32 UTC', placeholderHex: '64 caracteres hex · prefijo 0x opcional' },
    step3: { tag: 'Paso 3 · Metadatos y enviar', title: 'Etiquetar, firmar, enviar.', actionType: 'Tipo de acción', privacyMode: 'Modo de privacidad', vanishTitle: 'Vanish — revelación selectiva', vanishDesc: 'El hash está on-chain; la acción subyacente se queda off-chain.', publicTitle: 'Público — payload completo visible', publicDesc: 'Recibo estándar — cualquiera con la preimagen del hash puede verificar.' },
    success: { tag: 'Atestación escrita en Solana', tx: 'Firma de Tx', type: 'Tipo de acción', hash: 'Hash de acción', open: 'Abrir recibo', another: 'Emitir otro' },
    submit: { signing: 'Firmando y transmitiendo…', sign: 'Firmar con agente · enviar desde operador' },
    anatomy: ['Anatomía: 1 ix de pre-verificación Ed25519 (agente firma ', ' → action_hash) · 1 ix record_attestations · pagado por operador '],
    errors: {
      invalidKeypair: 'Error al procesar keypair',
      mismatch: 'Este keypair no coincide con el agente registrado. El ID del agente es {0}… pero la clave subida es {1}…',
      invalidHex: 'Hex inválido'
    }
  },
  ZH: {
    tag: '发出证明',
    headline: ['包装一个操作。', '获取收据。'],
    desc: ['使用您的代理密钥对签署操作哈希，程序会根据 ', 'agent_id', ' 验证 Ed25519 签名，收据将作为 ', 'AttestationIssued', ' 事件记录在 Solana 上。'],
    step0: { tag: '步骤 0 · 连接操作员', title: '连接注册此代理的操作员钱包。', cta: '连接钱包' },
    loadingAgent: '正在 devnet 上查找您注册的代理…',
    noAgent: { tag: '此操作员未注册代理', desc: '连接的钱包还没有 AgentAccount。请先注册一个。', cta: '打开注册流程' },
    revoked: { tag: '此代理已被撤销', desc: '程序拒绝为撤销的代理执行 record_attestations。请切换到其他操作员钱包。' },
    agentSummary: { operator: '操作员', pda: '代理 PDA', attestations: '已发出证明' },
    step1: { tag: '步骤 1 · 代理密钥对', title: '上传您在注册时保存的密钥对。', desc: '使用 FileReader 本地读取，从不传输。用于在链下签署每个 action_hash。', cta: '选择密钥对 JSON', success: '密钥对已加载 · 匹配 agent_id', replace: '替换' },
    step2: { tag: '步骤 2 · 操作哈希', title: '描述操作或粘贴 32 字节的哈希。', desc: '在生产环境中，这是结构化操作负载的确定性哈希。对于测试，输入描述，我们将为您计算 sha-256。', btnText: '描述 (sha256)', btnHex: '原始 Hex (32 字节)', placeholderText: '在 14:32 UTC 在 Jupiter 将 100 USDC 兑换为 SOL', placeholderHex: '64 个十六进制字符 · 0x 前缀可选' },
    step3: { tag: '步骤 3 · 元数据与提交', title: '标记，签署，发送。', actionType: '操作类型', privacyMode: '隐私模式', vanishTitle: 'Vanish — 选择性披露', vanishDesc: '哈希在链上；基础操作保留在链下。', publicTitle: '公开 — 完整负载可见', publicDesc: '标准收据 — 任何拥有哈希原像的人都可以验证。' },
    success: { tag: '证明已写入 Solana', tx: '交易签名', type: '操作类型', hash: '操作哈希', open: '打开收据', another: '发出另一个' },
    submit: { signing: '签名并广播中…', sign: '通过代理签名 · 由操作员发送' },
    anatomy: ['剖析：1 个 Ed25519 预验证 ix (代理签名 ', ' → action_hash) · 1 个 record_attestations ix · 由操作员 ', ' 支付。'],
    errors: {
      invalidKeypair: '解析密钥对失败',
      mismatch: '此密钥对与已注册的代理不匹配。代理 ID 为 {0}… 但上传的密钥为 {1}…',
      invalidHex: '无效的十六进制'
    }
  }
};

export function IssueAttestation() {
  const { lang } = useI18n();
  const t = content[lang];
  
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { program, readOnly } = useProvaProgram();
  const { authenticated } = usePrivy();
  const { wallets: solanaWallets } = usePrivySolanaWallets();
  const embeddedWallet = solanaWallets.find(w => w.standardWallet?.name === 'Privy');
  const privyPubkey = embeddedWallet ? new PublicKey(embeddedWallet.address) : null;
  const activePubkey = wallet.publicKey || privyPubkey;
  
  const operatorBase58 = activePubkey?.toBase58() ?? null;
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
        setHashError(e instanceof Error ? e.message : t.errors.invalidHex);
      }
    }
    return () => {
      cancelled = true;
    };
  }, [actionInput, hashMode, t.errors.invalidHex]);

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
            t.errors.mismatch.replace('{0}', expected.slice(0, 8)).replace('{1}', actual.slice(0, 8))
          );
        }
      }
      setAgentKeypair(kp);
    } catch (e) {
      setKeyError(e instanceof Error ? e.message : t.errors.invalidKeypair);
    }
  };

  const issue = async () => {
    if (!program || readOnly || !activePubkey || !agentKeypair || !actionHash) return;
    setIssuing(true);
    setError(null);
    setResult(null);
    try {
      const r = await issueAttestation({
        program,
        operator: activePubkey,
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

  const isConnected = wallet.connected || authenticated;

  const canIssue =
    !!agentKeypair &&
    !!actionHash &&
    !!agent &&
    !agent.revoked &&
    !readOnly &&
    !issuing &&
    isConnected;

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">{t.headline[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc[0]}
              <code className="font-mono text-foreground">{t.desc[1]}</code>
              {t.desc[2]}
              <code className="mx-1 font-mono text-foreground">{t.desc[3]}</code>
              {t.desc[4]}
            </p>
          </div>
        </div>

        {/* Pre-checks */}
        {!isConnected && (
          <section className="mt-16 border border-border bg-background p-6">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.step0.tag}</p>
            <h2 className="mt-2 font-display text-xl uppercase text-foreground">{t.step0.title}</h2>
            <Button onClick={() => openWalletModal(true)} className="mt-5 gap-2 font-mono uppercase tracking-wider">
              <Wallet className="h-4 w-4" />
              {t.step0.cta}
            </Button>
          </section>
        )}

        {isConnected && loadingAgent && (
          <div className="mt-16 flex items-center gap-3 border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.loadingAgent}
          </div>
        )}

        {isConnected && !loadingAgent && !agent && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <Inbox className="h-4 w-4" /> {t.noAgent.tag}
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {t.noAgent.desc}
            </p>
            <Button asChild className="mt-5 gap-2 font-mono uppercase tracking-wider">
              <Link href="/app/register">
                {t.noAgent.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </section>
        )}

        {isConnected && agent?.revoked && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <AlertTriangle className="h-4 w-4" /> {t.revoked.tag}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t.revoked.desc}
            </p>
          </section>
        )}

        {isConnected && agent && !agent.revoked && (
          <>
            {/* Agent summary */}
            <dl className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
              <Field label={t.agentSummary.operator}>
                <span className="break-all font-mono text-xs text-foreground">{activePubkey?.toBase58()}</span>
              </Field>
              <Field label={t.agentSummary.pda}>
                <Link
                  href={`/explorer/agent/${agent.address.toBase58()}`}
                  className="break-all font-mono text-xs text-foreground hover:text-primary"
                >
                  {agent.address.toBase58()}
                </Link>
              </Field>
              <Field label={t.agentSummary.attestations}>
                <span className="font-display text-2xl uppercase tabular-nums text-foreground">
                  {agent.attestationCount.toLocaleString()}
                </span>
              </Field>
            </dl>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              {/* Step 1: Upload keypair */}
              <section>
                <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.step1.tag}</h2>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                  {t.step1.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.step1.desc}
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
                      {t.step1.cta}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 border border-primary/40 bg-primary/4 px-4 py-3">
                        <CheckCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
                        <div className="min-w-0 flex-1">
                          <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.step1.success}</p>
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
                        {t.step1.replace}
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
                <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.step2.tag}</h2>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                  {t.step2.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.step2.desc}
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
                      {t.step2.btnText}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHashMode('hex')}
                      className={`flex-1 px-3 py-1.5 font-pixel text-[12px] ${
                        hashMode === 'hex' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t.step2.btnHex}
                    </button>
                  </div>

                  {hashMode === 'text' ? (
                    <textarea
                      value={actionInput}
                      onChange={(e) => setActionInput(e.target.value)}
                      placeholder={t.step2.placeholderText}
                      rows={3}
                      className="mt-3 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  ) : (
                    <input
                      value={actionInput}
                      onChange={(e) => setActionInput(e.target.value)}
                      placeholder={t.step2.placeholderHex}
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
              <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.step3.tag}</h2>
              <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">
                {t.step3.title}
              </h3>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12">
                <div>
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.step3.actionType}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ACTION_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActionType(type)}
                        className={`border px-3 py-2 text-left font-pixel text-[11px] uppercase tracking-wider transition-colors ${
                          actionType === type
                            ? 'border-primary bg-primary/6 text-foreground'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {ACTION_TYPE_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.step3.privacyMode}</p>
                  <button
                    type="button"
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`mt-2 flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors ${
                      privacyMode ? 'border-primary bg-primary/6' : 'border-border'
                    }`}
                  >
                    {privacyMode ? (
                      <EyeOff className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                    <div className="flex-1">
                      <p className="font-pixel text-[12px] uppercase tracking-wider text-foreground">
                        {privacyMode ? t.step3.vanishTitle : t.step3.publicTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {privacyMode ? t.step3.vanishDesc : t.step3.publicDesc}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-6 flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="wrap-break-word">{error}</span>
                </div>
              )}

              {result ? (
                <div className="mt-6 border border-primary/40 bg-primary/4 p-6">
                  <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
                    <CheckCircle className="h-4 w-4" /> {t.success.tag} {NETWORK}
                  </div>
                  <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
                    <Field label={t.success.tx}>
                      <a
                        href={explorerTxUrl(result.txSignature)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="break-all font-mono text-xs text-foreground hover:text-primary"
                      >
                        {result.txSignature} <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </Field>
                    <Field label={t.success.type}>
                      <span className="font-pixel text-[11px] uppercase tracking-wider">{ACTION_TYPE_LABELS[actionType]}</span>
                    </Field>
                    <Field label={t.success.hash}>
                      <span className="break-all font-mono text-xs text-foreground">{actionHash && bytesToHex(actionHash)}</span>
                    </Field>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                      <Link href={`/explorer/tx/${result.txSignature}`}>
                        {t.success.open} <ArrowRight className="h-3.5 w-3.5" />
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
                      {t.success.another}
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
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.submit.signing}
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      {t.submit.sign}
                    </>
                  )}
                </Button>
              )}

              {agentKeypair && actionHash && (
                <p className="mt-4 max-w-2xl font-mono text-[11px] text-muted-foreground">
                  {t.anatomy[0]}<code className="text-foreground">{shortPubkey(agentKeypair.publicKey, 4, 4)}</code>{' '}
                  {t.anatomy[1]}
                  {t.anatomy.length > 2 ? t.anatomy[2] : ''}
                  <code className="text-foreground">{activePubkey && shortPubkey(activePubkey, 4, 4)}</code>.
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
