'use client';
import { Badge, Separator } from '@prova/ui';
import { useI18n } from '@/components/i18n-provider';
import { Shield, Layers, Code, CheckCircle, AlertTriangle } from 'lucide-react';

const content = {
  EN: {
    tag: 'Documentation',
    title: 'Protocol Documentation',
    desc: 'Comprehensive technical documentation for the Prova Protocol. Built in accordance with the Solana Foundation Developer Guidelines (May 2026).',
    sections: {
      lifecycle: {
        title: '1. The Attestation Lifecycle',
        content: [
          'The Prova Protocol is an independent, open-source primitive designed to create verifiable, immutable records of AI agent behavior on the Solana blockchain.',
          'Under the "Public by Design" doctrine (Solana Foundation), all on-chain attestations are publicly queryable. The lifecycle consists of three steps:',
          'A. Action Hashing: The agent executes an action (e.g., an API call) and hashes the payload locally (SHA-256).',
          'B. Ed25519 Signing: The agent signs the hash using its local private key. Prova never custodies keys.',
          'C. On-chain Settlement: The ProvaClient submits the transaction using dynamic Priority Fees. The Anchor program verifies the signature natively via the Ed25519 pre-compile instruction.'
        ]
      },
      security: {
        title: '2. Security & Data Privacy',
        content: [
          'Prova implements a strict Zero-Trust model. According to the Solana Code of Conduct and Data Minimization principles, developers MUST NOT submit Personally Identifiable Information (PII) on-chain.',
          'If your agent processes sensitive data (e.g., healthcare or financial records), you must use Prova’s Confidential Compute Mode (Arcium integration).',
          'In Confidential Mode, the raw payload is encrypted within a Trusted Execution Environment (TEE) before the attestation is signed. The on-chain receipt proves the action occurred without leaking the underlying data.'
        ]
      },
      architecture: {
        title: '3. Anchor Architecture',
        content: [
          'The Prova Smart Contract (Program) is written in Rust using the Anchor framework. It is open-source (Apache 2.0) and designed for extreme cost-efficiency.',
          '• AgentAccount (PDA): Derived from the Operator\'s Pubkey. Stores the Agent ID, policy Merkle Root, and total attestation count.',
          '• Events: Instead of storing every receipt in expensive account state, Prova emits Anchor Events (`AttestationIssued`). Our WebSocket indexer (Helius LaserStream) captures these events with `finalized` commitment to prevent reorgs.',
          'This stateless design ensures that operators only pay a one-time rent exemption fee (~0.001 SOL) to register the agent, and standard transaction fees thereafter.'
        ]
      },
      compliance: {
        title: '4. KYA (Know Your Agent) & Ecosystem Compliance',
        content: [
          'As of May 2026, autonomous agents operating on Solana must maintain accountability. Prova supports the Metaplex 014 Registry (Core NFTs) to resolve Agent Identities.',
          'By integrating with standard registries, Prova ensures that bad actors can be identified and revoked by their operators, adhering to the anti-harassment and safety guidelines of the Solana ecosystem.',
          'Financial Disclaimer: Prova is a behavior logging protocol. It does not provide financial advice, custody funds, or route trades. Independent project. Not affiliated with the Solana Foundation. Solana® is a registered trademark.'
        ]
      }
    }
  },
  ES: {
    tag: 'Documentación',
    title: 'Documentación del Protocolo',
    desc: 'Documentación técnica completa del Protocolo Prova. Construido de acuerdo con las Directrices para Desarrolladores de la Solana Foundation (Mayo 2026).',
    sections: {
      lifecycle: {
        title: '1. El Ciclo de Vida de Atestación',
        content: [
          'El Protocolo Prova es una primitiva independiente y de código abierto diseñada para crear registros verificables e inmutables del comportamiento de agentes de IA en Solana.',
          'Bajo la doctrina "Público por Diseño" de la Solana Foundation, todas las atestaciones on-chain son consultables públicamente. El ciclo consta de tres pasos:',
          'A. Hashing de Acción: El agente ejecuta una acción y hashea el payload localmente (SHA-256).',
          'B. Firma Ed25519: El agente firma el hash usando su llave privada local. Prova nunca custodia llaves.',
          'C. Liquidación On-chain: ProvaClient envía la transacción usando Tarifas de Prioridad dinámicas. El programa Anchor verifica la firma nativamente vía la instrucción pre-compilada Ed25519.'
        ]
      },
      security: {
        title: '2. Seguridad y Privacidad de Datos',
        content: [
          'Prova implementa un modelo estricto de Zero-Trust. Según el Código de Conducta de Solana y los principios de Minimización de Datos, los desarrolladores NO DEBEN subir Información Personal Identificable (PII) on-chain.',
          'Si tu agente procesa datos sensibles, debes usar el Modo de Cómputo Confidencial de Prova (integración con Arcium).',
          'En este modo, el payload crudo se cifra dentro de un Entorno de Ejecución Confiable (TEE) antes de firmar la atestación. El recibo on-chain prueba que la acción ocurrió sin filtrar los datos subyacentes.'
        ]
      },
      architecture: {
        title: '3. Arquitectura Anchor',
        content: [
          'El Contrato Inteligente (Programa) está escrito en Rust usando Anchor. Es de código abierto (Apache 2.0) y diseñado para una eficiencia de costos extrema.',
          '• AgentAccount (PDA): Derivado de la llave del Operador. Almacena el ID del Agente, la Raíz Merkle de política y el conteo de atestaciones.',
          '• Eventos: En lugar de almacenar cada recibo en un costoso estado de cuenta, Prova emite Eventos Anchor (`AttestationIssued`). Nuestro indexador WebSocket captura estos eventos con finalidad (`finalized`) para prevenir reorgs.',
          'Este diseño sin estado asegura que los operadores solo paguen una tarifa de exención de renta única (~0.001 SOL) para registrar al agente.'
        ]
      },
      compliance: {
        title: '4. KYA (Conoce a tu Agente) y Cumplimiento del Ecosistema',
        content: [
          'A partir de mayo de 2026, los agentes autónomos en Solana deben mantener responsabilidad. Prova soporta el Registro 014 de Metaplex (Core NFTs) para resolver Identidades de Agentes.',
          'Al integrarse con registros estándar, Prova asegura que los malos actores puedan ser revocados por sus operadores, adhiriéndose a las pautas de seguridad y anti-acoso del ecosistema.',
          'Aviso Legal: Prova es un protocolo de registro de comportamiento. No provee asesoría financiera ni custodia fondos. Proyecto independiente. No afiliado a la Solana Foundation. Solana® es marca registrada.'
        ]
      }
    }
  },
  ZH: {
    tag: '文档',
    title: '协议文档',
    desc: 'Prova 协议的完整技术文档。根据 Solana 基金会开发者指南（2026年5月）构建。',
    sections: {
      lifecycle: {
        title: '1. 证明生命周期',
        content: [
          'Prova 协议是一个独立的开源原语，旨在在 Solana 区块链上创建 AI 代理行为的可验证且不可篡改的记录。',
          '根据 Solana 基金会的“公开设计”原则，所有链上证明都是公开可查询的。生命周期包括三个步骤：',
          'A. 操作哈希：代理执行操作并在本地对负载进行哈希处理 (SHA-256)。',
          'B. Ed25519 签名：代理使用其本地私钥对哈希进行签名。Prova 从不托管密钥。',
          'C. 链上结算：ProvaClient 使用动态优先级费用提交交易。Anchor 程序通过 Ed25519 预编译指令原生验证签名。'
        ]
      },
      security: {
        title: '2. 安全与数据隐私',
        content: [
          'Prova 实施严格的零信任模型。根据 Solana 行为准则和数据最小化原则，开发者绝不能在链上提交个人身份信息 (PII)。',
          '如果您的代理处理敏感数据，则必须使用 Prova 的机密计算模式（Arcium 集成）。',
          '在机密模式下，原始负载在被签名之前在可信执行环境 (TEE) 内进行加密。链上收据证明了操作已发生，而不会泄露底层数据。'
        ]
      },
      architecture: {
        title: '3. Anchor 架构',
        content: [
          '智能合约使用 Anchor 框架以 Rust 编写。它是开源的 (Apache 2.0) 并且专为极高的成本效益而设计。',
          '• AgentAccount (PDA)：由操作员公钥派生。存储代理 ID、策略 Merkle 根和总证明计数。',
          '• 事件：Prova 不在昂贵的账户状态中存储每一张收据，而是发出 Anchor 事件 (`AttestationIssued`)。我们的 WebSocket 索引器以 `finalized` 级别捕获这些事件以防止重组。',
          '这种无状态设计确保操作员只需支付一次性租金豁免费（约 0.001 SOL）即可注册代理。'
        ]
      },
      compliance: {
        title: '4. KYA（了解您的代理）与生态系统合规',
        content: [
          '截至 2026 年 5 月，Solana 上的自主代理必须保持问责制。Prova 支持 Metaplex 014 注册表 (Core NFTs) 以解析代理身份。',
          '通过与标准注册表集成，Prova 确保不良行为者可以被其操作员撤销，遵守生态系统的反骚扰和安全准则。',
          '法律免责声明：Prova 是一个行为记录协议。不提供财务建议、不托管资金。独立项目。不隶属于 Solana 基金会。Solana® 是注册商标。'
        ]
      }
    }
  }
};

export function DocsContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Badge variant="secondary" className="mb-4">{t.tag}</Badge>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{t.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          {t.desc}
        </p>

        <Separator className="my-12 bg-border/50" />

        <div className="space-y-16">
          {/* Section 1: Lifecycle */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.lifecycle.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.lifecycle.content.map((p, i) => (
                <p key={i} className={p.startsWith('A.') || p.startsWith('B.') || p.startsWith('C.') ? "pl-6 border-l-2 border-primary/30" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Section 2: Security */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.security.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.security.content.map((p, i) => (
                <p key={i} className={i === 1 ? "bg-red-500/10 text-red-200 p-4 rounded-md border border-red-500/20 flex gap-3" : ""}>
                  {i === 1 && <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />}
                  <span>{p}</span>
                </p>
              ))}
            </div>
          </section>

          {/* Section 3: Architecture */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Code className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.architecture.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.architecture.content.map((p, i) => (
                <p key={i} className={p.startsWith('•') ? "pl-6 font-mono text-sm text-primary/80" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Section 4: Compliance */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.compliance.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.compliance.content.map((p, i) => (
                <p key={i} className={p.startsWith('Financial Disclaimer') || p.startsWith('Aviso Legal') || p.startsWith('法律免责声明') ? "text-xs uppercase tracking-wider opacity-60 mt-8" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
