'use client';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'How it works',
    headline: ['From agent action', 'to immutable proof', 'in three steps.'],
    steps: [
      {
        n: '01',
        title: 'Your agent acts',
        desc: 'A swap, a transfer, a tool call, a model decision — anything you want on the record. Wrap it with `client.attest()` or let the SDK middleware do it for you.',
      },
      {
        n: '02',
        title: 'The SDK signs and submits',
        desc: 'The action payload is hashed, signed by the agent key, and written through the Solana Attestation Service. Confirmation in under a second, ~$0.0005 per receipt.',
      },
      {
        n: '03',
        title: 'Anyone verifies, anytime',
        desc: 'The receipt lives on-chain as a PDA. Operators, regulators, insurers, and counterparties verify it without ever talking to Prova. No API key required.',
      },
    ]
  },
  ES: {
    sectionTitle: 'Cómo funciona',
    headline: ['Desde la acción del agente', 'hasta la prueba inmutable', 'en tres pasos.'],
    steps: [
      {
        n: '01',
        title: 'Tu agente actúa',
        desc: 'Un swap, una transferencia, una llamada de herramienta, una decisión de modelo — cualquier cosa que quieras dejar registrada. Envuélvelo con `client.attest()` o deja que el middleware del SDK lo haga por ti.',
      },
      {
        n: '02',
        title: 'El SDK firma y envía',
        desc: 'El payload de la acción se hashea, se firma con la clave del agente y se escribe a través del Solana Attestation Service. Confirmación en menos de un segundo, ~$0.0005 por recibo.',
      },
      {
        n: '03',
        title: 'Cualquiera verifica, en cualquier momento',
        desc: 'El recibo vive on-chain como un PDA. Operadores, reguladores, aseguradoras y contrapartes lo verifican sin tener que hablar nunca con Prova. No se requiere API key.',
      },
    ]
  },
  ZH: {
    sectionTitle: '工作原理',
    headline: ['从代理操作', '到不可篡改的证明', '只需三步。'],
    steps: [
      {
        n: '01',
        title: '你的代理执行操作',
        desc: '无论是代币兑换、转账、工具调用还是模型决策 —— 任何你想记录下来的内容。使用 `client.attest()` 包装它，或者让 SDK 的中间件为你代劳。',
      },
      {
        n: '02',
        title: 'SDK 签名并提交',
        desc: '操作的负载数据会被哈希处理，由代理密钥签名，并通过 Solana Attestation Service 写入链上。不到一秒内即可确认，单据成本约 $0.0005。',
      },
      {
        n: '03',
        title: '任何人在任何时候都可以验证',
        desc: '收据作为 PDA 存储在链上。操作员、监管机构、保险公司和交易对手可以在无需与 Prova 交互的情况下进行验证。无需 API 密钥。',
      },
    ]
  }
};

export function HowItWorks() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.sectionTitle}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="mt-2 block text-muted-foreground">{t.headline[2]}</span>
            </h2>
          </div>
        </div>

        <ol className="border-t border-border">
          {t.steps.map((s) => (
            <li
              key={s.n}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-[auto_1fr_2fr] lg:gap-12 lg:py-14"
            >
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="font-display text-lg uppercase tracking-tight text-foreground lg:text-xl">{s.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
