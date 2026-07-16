import type { LocalizedDoc } from './types';

const installCode = `npm install prova-plugin-eliza prova-agent-sdk`;

const quickStartCode = `import { provaPlugin, attesterFromProvaClient } from 'prova-plugin-eliza';
import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const prova = new ProvaClient({
  rpcUrl: process.env.PROVA_RPC_URL!,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});

const attester = attesterFromProvaClient(
  prova,
  ProvaClient.hashAction,
  operatorKeypair,
);

// Add to your runtime's plugins:
const runtime = new AgentRuntime({
  plugins: [provaPlugin({ attester })],
  // ...other character configuration...
});`;

const shutdownCode = `import { createProvaPlugin } from 'prova-plugin-eliza';

const { plugin, flush, stop } = createProvaPlugin({ attester });
// plugins: [plugin] ...
await stop(); // guaranteed final flush when the agent shuts down`;

export const pluginEliza: LocalizedDoc = {
  EN: {
    title: 'elizaOS Plugin',
    intro:
      '`prova-plugin-eliza` is the official plugin to connect Prova with elizaOS agents. Every action executed by your character gets a verifiable, Ed25519-signed receipt on Solana without touching your agent logic.',
    blocks: [
      { kind: 'h2', text: 'How it works' },
      {
        kind: 'list',
        items: [
          'On initialization, the plugin intercepts the handler of every registered character action and hooks the runtime actions pipeline.',
          'After each handler resolves, the plugin hashes the action name, message content, and result (SHA-256) and queues the attestation.',
          'Attestations are automatically batched using a debouncer, writing up to 100 receipts in a single transaction to eliminate rent costs.',
          'The plugin works off-chain with structural typing, ensuring it never imports `@elizaos/core` directly to stay lightweight and compatible across versions.',
        ],
      },
      { kind: 'h2', text: 'Install' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Quick start' },
      { kind: 'code', code: quickStartCode },
      { kind: 'h2', text: 'Shutdown control' },
      { kind: 'code', code: shutdownCode },
      { kind: 'h2', text: 'Options' },
      {
        kind: 'table',
        headers: ['Option', 'Default', 'Description'],
        rows: [
          ['`attester`', '—', 'Bridge to Prova. Build it with `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'attest all', 'Predicate filter by action name — return `false` to skip attesting that action.'],
          ['`batch.maxSize`', '`25`', 'Flushes immediately when the queue reaches N items (1–100).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce time in milliseconds. Buffers bursts of actions into a single transaction.'],
          ['`onError`', 'console warn', 'Fallback hook on attestation failure; the agent\'s action itself is unaffected.'],
        ],
      },
    ],
  },
  ES: {
    title: 'Plugin elizaOS',
    intro:
      '`prova-plugin-eliza` es el plugin oficial para conectar Prova con agentes de elizaOS. Cada acción ejecutada por tu personaje recibe un recibo firmado por Ed25519 en Solana sin alterar la lógica de tu agente.',
    blocks: [
      { kind: 'h2', text: 'Cómo funciona' },
      {
        kind: 'list',
        items: [
          'Al inicializarse, el plugin intercepta el handler de cada acción registrada del personaje y se conecta a la tubería de acciones de ejecución.',
          'Al resolverse el handler, construye un payload con el nombre de la acción, mensaje e input, lo hashea (SHA-256) y encola la atestación.',
          'Las atestaciones se agrupan en batches por un debouncer, escribiendo hasta 100 recibos en una sola transacción para eliminar costes de rent.',
          'El plugin funciona mediante tipado estructural sin importar `@elizaos/core` directamente, lo que garantiza ligereza y compatibilidad entre versiones.',
        ],
      },
      { kind: 'h2', text: 'Instalar' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Inicio rápido' },
      { kind: 'code', code: quickStartCode },
      { kind: 'h2', text: 'Control de apagado' },
      { kind: 'code', code: shutdownCode },
      { kind: 'h2', text: 'Opciones' },
      {
        kind: 'table',
        headers: ['Opción', 'Predeterminado', 'Descripción'],
        rows: [
          ['`attester`', '—', 'Puente hacia Prova. Constrúyelo con `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'atesta todo', 'Predicado de filtrado por nombre de acción — devuelve `false` para omitir.'],
          ['`batch.maxSize`', '`25`', 'Flush inmediato al llegar a N items encolados (1–100).'],
          ['`batch.flushDelayMs`', '`1000`', 'Tiempo de debounce en milisegundos. Agrupa ráfagas de acciones en una sola transacción.'],
          ['`onError`', 'warn por consola', 'Se llama si falla la atestación; la acción del agente nunca se ve afectada.'],
        ],
      },
    ],
  },
  ZH: {
    title: 'elizaOS 插件',
    intro:
      '`prova-plugin-eliza` 是将 Prova 连接到 elizaOS 代理的官方插件。您的角色执行的每个操作都会在 Solana 上获得一个可验证的、经过 Ed25519 签名的收据，而无需触及您的代理逻辑。',
    blocks: [
      { kind: 'h2', text: '工作原理' },
      {
        kind: 'list',
        items: [
          '在初始化时，插件会拦截每个已注册角色操作的 handler，并挂钩到运行时操作管道中。',
          '在每个 handler 解析后，插件会将操作名称、消息内容和结果哈希化 (SHA-256) 并将证明加入队列。',
          '证明通过防抖自动批量处理，在一次交易中写入最多 100 条收据，从而消除租金成本。',
          '该插件在链下通过结构化类型工作，确保从不直接导入 `@elizaos/core`，从而保持轻量且跨版本兼容。',
        ],
      },
      { kind: 'h2', text: '安装' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: '快速上手' },
      { kind: 'code', code: quickStartCode },
      { kind: 'h2', text: '关机控制' },
      { kind: 'code', code: shutdownCode },
      { kind: 'h2', text: '选项' },
      {
        kind: 'table',
        headers: ['选项', '默认值', '说明'],
        rows: [
          ['`attester`', '—', '通往 Prova 的桥。用 `attesterFromProvaClient(client, hashAction, operatorKeypair)` 构建。'],
          ['`rules`', '全部证明', '按操作名称过滤谓词 — 返回 `false` 跳过证明该操作。'],
          ['`batch.maxSize`', '`25`', '队列达到 N 条时立即发送（每笔交易 1–100 条）。'],
          ['`batch.flushDelayMs`', '`1000`', '防抖时间（毫秒）。将一连串工具调用缓冲入同一笔交易。'],
          ['`onError`', '控制台警告', '证明失败时调用；代理操作本身不受影响。'],
        ],
      },
    ],
  },
};
