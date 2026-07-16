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
          'The easiest way to integrate Prova with an elizaOS agent is via the official plugin (npm: prova-plugin-eliza).',
          'import { provaPlugin, attesterFromProvaClient } from "prova-plugin-eliza";\nimport { ProvaClient } from "prova-agent-sdk";\n\nconst prova = new ProvaClient({ rpcUrl, agentKeypair });\nconst attester = attesterFromProvaClient(\n  prova, ProvaClient.hashAction, operatorKeypair,\n);\n\n// Add to your runtime\'s plugins array:\nconst runtime = new AgentRuntime({\n  // ...character, model provider, etc.\n  plugins: [provaPlugin({ attester })],\n});',
          'Once configured, the agent automatically hashes and attests every action it executes — bursts are batched into a single Solana transaction, and a Prova failure never breaks the action.'
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
          'Solana programs can invoke the Prova contract directly via Cross-Program Invocation (CPI). The Ed25519 pre-verify instruction must be added at the transaction level by the client — the program validates it through the instructions sysvar.',
          '// Rust CPI Example (prova-program with the "cpi" feature)\nlet cpi_ctx = CpiContext::new(\n    prova_program.to_account_info(),\n    prova_program::cpi::accounts::RecordAttestations {\n        agent: agent_account.to_account_info(),\n        operator: operator.to_account_info(),\n        instructions: instructions_sysvar.to_account_info(),\n    },\n);\n\nprova_program::cpi::record_attestations(cpi_ctx, vec![AttestationInput {\n    action_type: ActionType::ToolCall,\n    action_hash,\n    privacy_mode: false,\n    signature,\n}])?;'
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
          'La forma más fácil de integrar Prova con un agente elizaOS es vía el plugin oficial (npm: prova-plugin-eliza).',
          'import { provaPlugin, attesterFromProvaClient } from "prova-plugin-eliza";\nimport { ProvaClient } from "prova-agent-sdk";\n\nconst prova = new ProvaClient({ rpcUrl, agentKeypair });\nconst attester = attesterFromProvaClient(\n  prova, ProvaClient.hashAction, operatorKeypair,\n);\n\n// Agrégalo al array de plugins de tu runtime:\nconst runtime = new AgentRuntime({\n  // ...character, model provider, etc.\n  plugins: [provaPlugin({ attester })],\n});',
          'Una vez configurado, el agente hashea y atesta automáticamente cada acción que ejecuta — las ráfagas se agrupan en una sola transacción de Solana, y un fallo de Prova jamás rompe la acción.'
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
          'Los programas de Solana pueden invocar el contrato Prova directamente vía Cross-Program Invocation (CPI). La instrucción Ed25519 de pre-verificación debe añadirla el cliente a nivel de transacción — el programa la valida vía el instructions sysvar.',
          '// Rust CPI Example (prova-program con el feature "cpi")\nlet cpi_ctx = CpiContext::new(\n    prova_program.to_account_info(),\n    prova_program::cpi::accounts::RecordAttestations {\n        agent: agent_account.to_account_info(),\n        operator: operator.to_account_info(),\n        instructions: instructions_sysvar.to_account_info(),\n    },\n);\n\nprova_program::cpi::record_attestations(cpi_ctx, vec![AttestationInput {\n    action_type: ActionType::ToolCall,\n    action_hash,\n    privacy_mode: false,\n    signature,\n}])?;'
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
          '将 Prova 与 elizaOS 代理集成的最简单方法是通过官方插件（npm：prova-plugin-eliza）。',
          'import { provaPlugin, attesterFromProvaClient } from "prova-plugin-eliza";\nimport { ProvaClient } from "prova-agent-sdk";\n\nconst prova = new ProvaClient({ rpcUrl, agentKeypair });\nconst attester = attesterFromProvaClient(\n  prova, ProvaClient.hashAction, operatorKeypair,\n);\n\n// 添加到 runtime 的 plugins 数组：\nconst runtime = new AgentRuntime({\n  // ...character、model provider 等\n  plugins: [provaPlugin({ attester })],\n});',
          '配置完成后，代理会自动对其执行的每个操作进行哈希和证明 — 连续操作会打包进一笔 Solana 交易，且 Prova 故障绝不会中断操作。'
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
          'Solana 程序可以通过跨程序调用 (CPI) 直接调用 Prova 合约。Ed25519 预验证指令必须由客户端添加到交易层 — 程序通过 instructions sysvar 验证它。',
          '// Rust CPI 示例（启用 "cpi" feature 的 prova-program）\nlet cpi_ctx = CpiContext::new(\n    prova_program.to_account_info(),\n    prova_program::cpi::accounts::RecordAttestations {\n        agent: agent_account.to_account_info(),\n        operator: operator.to_account_info(),\n        instructions: instructions_sysvar.to_account_info(),\n    },\n);\n\nprova_program::cpi::record_attestations(cpi_ctx, vec![AttestationInput {\n    action_type: ActionType::ToolCall,\n    action_hash,\n    privacy_mode: false,\n    signature,\n}])?;'
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
