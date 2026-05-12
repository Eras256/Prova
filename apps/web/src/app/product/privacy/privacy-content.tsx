'use client';
import { EyeOff } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Product',
    title: 'Privacy Mode',
    desc: 'Selective disclosure via Vanish Core. Prove an AI action was executed without leaking proprietary prompts.',
    mechanismLabel: 'Mechanism',
    steps: [
      { t: 'Off-chain Payload', d: 'The sensitive JSON payload is never broadcasted to the Solana network.' },
      { t: 'On-chain Hash', d: 'Only the deterministic SHA-256 hash of the payload is sealed on-chain.' },
      { t: 'Selective Disclosure', d: 'You choose when and with whom to share the original payload.' },
      { t: 'Cryptographic Verification', d: 'Any third party can hash your disclosed payload and match it against the immutable on-chain record.' },
    ],
  },
  ES: {
    tag: 'Producto',
    title: 'Modo Privacidad',
    desc: 'Divulgación selectiva con Vanish Core. Prueba que una acción de IA ocurrió sin filtrar tus prompts propietarios.',
    mechanismLabel: 'Mecanismo',
    steps: [
      { t: 'Payload Off-chain', d: 'El payload JSON sensible nunca es transmitido a la red de Solana.' },
      { t: 'Hash On-chain', d: 'Solo el hash determinista SHA-256 del payload se sella en la blockchain.' },
      { t: 'Divulgación Selectiva', d: 'Tú eliges cuándo y con quién compartir el payload original.' },
      { t: 'Verificación Criptográfica', d: 'Cualquier tercero puede aplicar hash a tu payload divulgado y compararlo con el registro on-chain inmutable.' },
    ],
  },
  ZH: {
    tag: '产品',
    title: '隐私模式',
    desc: '使用 Vanish Core 进行选择性披露。证明 AI 操作已执行，而不会泄露专有提示词。',
    mechanismLabel: '机制',
    steps: [
      { t: '链下负载', d: '敏感的 JSON 负载永远不会被广播到 Solana 网络。' },
      { t: '链上哈希', d: '只有负载的确定性 SHA-256 哈希会被密封在链上。' },
      { t: '选择性披露', d: '您选择何时以及与谁共享原始负载。' },
      { t: '密码学验证', d: '任何第三方都可以对您披露的负载进行哈希处理，并将其与不可变的链上记录进行匹配。' },
    ],
  },
};

export function PrivacyContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <EyeOff className="mb-4 h-10 w-10 text-primary" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.mechanismLabel}</p>
          </div>
          <div className="space-y-px border border-border">
            {t.steps.map((s) => (
              <div key={s.t} className="border-b border-border bg-surface px-5 py-4 last:border-b-0">
                <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
