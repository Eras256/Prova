'use client';
import { Badge, Separator } from '@prova/ui';
import { useI18n } from '@/components/i18n-provider';
import { Bot, TerminalSquare, Workflow } from 'lucide-react';

const content = {
  EN: {
    tag: 'Examples',
    title: 'Code Examples',
    desc: 'Real-world examples showing how to integrate Prova into your existing agent architectures.',
    sections: {
      eliza: {
        title: 'elizaOS Plugin',
        content: [
          'The easiest way to integrate Prova with an elizaOS agent is via the official plugin.',
          'import { provaPlugin } from "@prova/plugin-eliza";',
          '// Add to your character configuration:\n{\n  "plugins": [provaPlugin],\n  "settings": {\n    "secrets": {\n      "PROVA_RPC_URL": "...",\n      "PROVA_WALLET_PRIVATE_KEY": "..."\n    }\n  }\n}',
          'Once configured, the agent will automatically hash and attest every tool call and blockchain transaction it executes.'
        ]
      },
      defi: {
        title: 'DeFi Swap Agent',
        content: [
          'If you are building a custom agent using the @solana/web3.js library, you can manually wrap Jupiter swaps.',
          '// 1. Agent executes swap\nconst swapTx = await jupiter.executeSwap(route);\n\n// 2. Hash swap parameters\nconst hash = await ProvaClient.hashAction(JSON.stringify(route));\n\n// 3. Issue attestation\nawait provaClient.attest({\n  operatorKeypair: wallet,\n  actionHash: hash,\n  actionType: "Transaction"\n});'
        ]
      },
      anchor: {
        title: 'Native Anchor CPI',
        content: [
          'Solana programs can invoke the Prova contract directly via Cross-Program Invocation (CPI).',
          '// Rust CPI Example\nprova_agent_program::cpi::record_attestation(\n    CpiContext::new(\n        prova_program.to_account_info(),\n        RecordAttestation {\n            agent: agent_account.to_account_info(),\n            operator: operator.to_account_info(),\n            system_program: system_program.to_account_info(),\n        },\n    ),\n    action_hash,\n    action_type,\n    privacy_mode\n)?;'
        ]
      }
    }
  },
  ES: {
    tag: 'Ejemplos',
    title: 'Ejemplos de Código',
    desc: 'Ejemplos del mundo real que muestran cómo integrar Prova en tus arquitecturas de agentes existentes.',
    sections: {
      eliza: {
        title: 'Plugin para elizaOS',
        content: [
          'La forma más fácil de integrar Prova con un agente elizaOS es vía el plugin oficial.',
          'import { provaPlugin } from "@prova/plugin-eliza";',
          '// Agrega a la configuración de tu personaje:\n{\n  "plugins": [provaPlugin],\n  "settings": {\n    "secrets": {\n      "PROVA_RPC_URL": "...",\n      "PROVA_WALLET_PRIVATE_KEY": "..."\n    }\n  }\n}',
          'Una vez configurado, el agente automáticamente hasheará y atestará cada llamada a herramienta y transacción.'
        ]
      },
      defi: {
        title: 'Agente DeFi Swaps',
        content: [
          'Si construyes un agente personalizado usando @solana/web3.js, puedes envolver swaps de Jupiter.',
          '// 1. El agente ejecuta el swap\nconst swapTx = await jupiter.executeSwap(route);\n\n// 2. Hashear parámetros\nconst hash = await ProvaClient.hashAction(JSON.stringify(route));\n\n// 3. Emitir atestación\nawait provaClient.attest({\n  operatorKeypair: wallet,\n  actionHash: hash,\n  actionType: "Transaction"\n});'
        ]
      },
      anchor: {
        title: 'CPI Nativo en Anchor',
        content: [
          'Los programas de Solana pueden invocar el contrato Prova directamente vía Cross-Program Invocation (CPI).',
          '// Ejemplo CPI en Rust\nprova_agent_program::cpi::record_attestation(\n    CpiContext::new(\n        prova_program.to_account_info(),\n        RecordAttestation {\n            agent: agent_account.to_account_info(),\n            operator: operator.to_account_info(),\n            system_program: system_program.to_account_info(),\n        },\n    ),\n    action_hash,\n    action_type,\n    privacy_mode\n)?;'
        ]
      }
    }
  },
  ZH: {
    tag: '示例',
    title: '代码示例',
    desc: '展示如何将 Prova 集成到您现有的代理架构中的真实示例。',
    sections: {
      eliza: {
        title: 'elizaOS 插件',
        content: [
          '将 Prova 与 elizaOS 代理集成的最简单方法是通过官方插件。',
          'import { provaPlugin } from "@prova/plugin-eliza";',
          '// 添加到您的角色配置中：\n{\n  "plugins": [provaPlugin],\n  "settings": {\n    "secrets": {\n      "PROVA_RPC_URL": "...",\n      "PROVA_WALLET_PRIVATE_KEY": "..."\n    }\n  }\n}',
          '配置完成后，代理将自动对其执行的每个工具调用和区块链交易进行哈希和证明。'
        ]
      },
      defi: {
        title: 'DeFi 交换代理',
        content: [
          '如果您使用 @solana/web3.js 库构建自定义代理，则可以手动封装 Jupiter 交换。',
          '// 1. 代理执行交换\nconst swapTx = await jupiter.executeSwap(route);\n\n// 2. 哈希交换参数\nconst hash = await ProvaClient.hashAction(JSON.stringify(route));\n\n// 3. 发出证明\nawait provaClient.attest({\n  operatorKeypair: wallet,\n  actionHash: hash,\n  actionType: "Transaction"\n});'
        ]
      },
      anchor: {
        title: '原生 Anchor CPI',
        content: [
          'Solana 程序可以通过跨程序调用 (CPI) 直接调用 Prova 合约。',
          '// Rust CPI 示例\nprova_agent_program::cpi::record_attestation(\n    CpiContext::new(\n        prova_program.to_account_info(),\n        RecordAttestation {\n            agent: agent_account.to_account_info(),\n            operator: operator.to_account_info(),\n            system_program: system_program.to_account_info(),\n        },\n    ),\n    action_hash,\n    action_type,\n    privacy_mode\n)?;'
        ]
      }
    }
  }
};

export function ExamplesContent() {
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
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.eliza.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.eliza.content.map((p, i) => {
                if (p.includes('import ') || p.includes('//') || p.includes('{\n')) {
                  return (
                    <div key={i} className="mt-4 overflow-x-auto border border-border bg-surface p-5">
                      <pre className="font-mono text-sm text-primary/90">{p}</pre>
                    </div>
                  );
                }
                return <p key={i}>{p}</p>;
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Workflow className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.defi.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.defi.content.map((p, i) => {
                if (p.includes('// 1.')) {
                  return (
                    <div key={i} className="mt-4 overflow-x-auto border border-border bg-surface p-5">
                      <pre className="font-mono text-sm text-primary/90">{p}</pre>
                    </div>
                  );
                }
                return <p key={i}>{p}</p>;
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <TerminalSquare className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.anchor.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.anchor.content.map((p, i) => {
                if (p.includes('// Rust CPI')) {
                  return (
                    <div key={i} className="mt-4 overflow-x-auto border border-border bg-surface p-5">
                      <pre className="font-mono text-sm text-primary/90">{p}</pre>
                    </div>
                  );
                }
                return <p key={i}>{p}</p>;
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
