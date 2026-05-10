'use client';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The Architecture',
    headline: ['From agent intent', 'to cryptographic proof', 'in milliseconds.'],
    steps: [
      {
        n: '01',
        title: 'Your Agent Executes (elizaOS compatible)',
        desc: 'A DeFi swap via Jupiter, an API payment, or a governance vote. Wrap it with `client.attest()` or use our native elizaOS plugin to secure the intent.',
      },
      {
        n: '02',
        title: 'The SDK Signs via MPP',
        desc: 'The payload is hashed and signed with the agent\'s Ed25519 key utilizing the Machine Payment Protocol standard. Confirmation in <400ms, ~$0.0005 per receipt.',
      },
      {
        n: '03',
        title: 'Trustless Enterprise Verification',
        desc: 'The receipt is permanently anchored to Solana as a PDA. Auditors, risk teams, and insurers verify it trustlessly without relying on Prova\'s infrastructure.',
      },
      {
        n: '04',
        title: 'Native MCP Context Engine',
        desc: 'Our MCP server allows Claude, Cursor, and enterprise LLMs to autonomously query "What did Agent X do on Tuesday?" and receive verified on-chain state instantly.',
      },
    ]
  },
  ES: {
    sectionTitle: 'La Arquitectura',
    headline: ['Desde la intención del agente', 'hasta la prueba criptográfica', 'en milisegundos.'],
    steps: [
      {
        n: '01',
        title: 'Tu Agente Ejecuta (Compatible con elizaOS)',
        desc: 'Un swap DeFi vía Jupiter, un pago de API o un voto de gobernanza. Envuélvelo con `client.attest()` o usa nuestro plugin nativo para elizaOS.',
      },
      {
        n: '02',
        title: 'El SDK Firma vía MPP',
        desc: 'El payload se hashea y se firma con la clave Ed25519 del agente utilizando el estándar Machine Payment Protocol. Confirmación en <400ms, ~$0.0005 por recibo.',
      },
      {
        n: '03',
        title: 'Verificación Empresarial Trustless',
        desc: 'El recibo se ancla permanentemente a Solana como un PDA. Auditores, equipos de riesgo y aseguradoras lo verifican sin depender de la infraestructura de Prova.',
      },
      {
        n: '04',
        title: 'Motor de Contexto MCP Nativo',
        desc: 'Nuestro servidor MCP permite que Claude, Cursor y LLMs empresariales consulten de forma autónoma "¿Qué hizo el Agente X el martes?" y reciban el estado on-chain verificado.',
      },
    ]
  },
  ZH: {
    sectionTitle: '工作原理',
    headline: ['从代理操作', '到不可篡改的证明', '只需四步。'],
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
      {
        n: '04',
        title: '从 AI IDE 直接查询',
        desc: '原生 MCP 服务器让 Claude、Cursor 或任何支持 MCP 的工具直接询问"代理 X 上周做了什么？"并获得经过验证的链上数据 —— 无需手动打开区块链浏览器。',
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
