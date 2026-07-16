import type { LocalizedDoc } from './types';

const installCode = `npm install prova-agent-kit prova-agent-sdk`;

const attachCode = `import { attachProva, attesterFromProvaClient } from 'prova-agent-kit';
import { ProvaClient } from 'prova-agent-sdk';

const prova = new ProvaClient({ rpcUrl, agentKeypair });
const attester = attesterFromProvaClient(
  prova,
  ProvaClient.hashAction,
  operatorKeypair,
);

// Call AFTER registering all your Solana Agent Kit plugins:
const handle = attachProva(agent, { attester });

// ... your agent runs normally; every action is attested automatically ...

await handle.stop(); // final flush — call when shutting the agent down`;

const optionsCode = `const handle = attachProva(agent, {
  attester,
  // Only attest specific actions:
  rules: (actionName) => actionName.startsWith('trade_'),
  // Tune batching:
  batch: {
    maxSize: 25,        // flush immediately at N items (1–100)
    flushDelayMs: 1000, // debounce: flush N ms after the LAST action
  },
  // Custom error handling (attestation never breaks the action):
  onError: (error, { action }) => log.warn({ action, error }),
});`;

const walletCode = `import { ProvaWallet } from 'prova-agent-kit';

// Wraps any SAK BaseWallet: captures the REAL on-chain signature
// of every transaction the agent signs and attests it.
const wallet = new ProvaWallet(innerWallet, { attester });

const agent = new SolanaAgentKit(wallet, rpcUrl, config);`;

export const agentKit: LocalizedDoc = {
  EN: {
    title: 'Agent Kit Adapter',
    intro:
      '`prova-agent-kit` plugs Prova into Solana Agent Kit v2 with two lines. Every action your agent executes is captured, hashed, batched, and sealed on-chain — without touching your agent logic.',
    blocks: [
      { kind: 'h2', text: 'How it captures actions' },
      {
        kind: 'list',
        items: [
          '`attachProva(agent)` wraps each registered action handler: after the handler resolves, the adapter builds a payload from the action name, input, and result, hashes it, and queues the attestation. Rich semantics, zero changes to your code.',
          '`ProvaWallet` decorates the SAK `BaseWallet`: it captures the real on-chain transaction signature at signing time — proof of the exact transaction, not just the intent.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Attestation is fire-and-forget: a Prova failure never breaks or slows down the agent action. Errors go to `onError` (default: console warning).',
      },
      { kind: 'h2', text: 'Install' },
      { kind: 'code', code: installCode },
      {
        kind: 'p',
        text: 'The adapter never imports `solana-agent-kit` — it relies on TypeScript structural typing, so it stays a lightweight dependency validated against SAK v2.',
      },
      { kind: 'h2', text: 'Quick start' },
      { kind: 'code', code: attachCode },
      { kind: 'h2', text: 'Options' },
      { kind: 'code', code: optionsCode },
      {
        kind: 'table',
        headers: ['Option', 'Default', 'Description'],
        rows: [
          ['`attester`', '—', 'Bridge to Prova. Build it with `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'attest all', 'Predicate by action name — return `false` to skip an action.'],
          ['`batch.maxSize`', '`25`', 'Immediate flush at N queued items (1–100 per transaction).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce: flush N ms after the last action, so a burst of tool calls lands in ONE transaction. `0` = attest each action immediately.'],
          ['`onError`', 'console warn', 'Called on attestation failure; the agent action itself is never affected.'],
        ],
      },
      { kind: 'h2', text: 'Batching semantics' },
      {
        kind: 'p',
        text: 'Multi-tool-calling agents fire actions in bursts. The batcher groups a burst by debounce: it waits `flushDelayMs` after the last action, then sends everything in one `record_attestations` transaction (up to 100). Reaching `maxSize` flushes immediately. `handle.flush()` forces a send; `handle.stop()` does a final guaranteed flush — always call it on shutdown.',
      },
      { kind: 'h2', text: 'Wallet-level capture' },
      { kind: 'code', code: walletCode },
      { kind: 'h2', text: 'What gets attested' },
      {
        kind: 'table',
        headers: ['Source', 'Payload', 'Action type'],
        rows: [
          ['Action handler', 'Action name + input + result (hashed, never on-chain).', 'Mapped from the action name (`ToolCall`, `Transaction`, …).'],
          ['`ProvaWallet`', 'The real transaction signature.', '`Transaction`.'],
        ],
      },
    ],
  },
  ES: {
    title: 'Adapter Agent Kit',
    intro:
      '`prova-agent-kit` conecta Prova con Solana Agent Kit v2 en dos líneas. Cada acción que ejecuta tu agente se captura, hashea, agrupa y sella on-chain — sin tocar la lógica de tu agente.',
    blocks: [
      { kind: 'h2', text: 'Cómo captura las acciones' },
      {
        kind: 'list',
        items: [
          '`attachProva(agent)` envuelve cada handler de acción registrado: al resolver el handler, el adapter construye un payload con el nombre de la acción, el input y el resultado, lo hashea y encola la atestación. Semántica rica, cero cambios en tu código.',
          '`ProvaWallet` decora el `BaseWallet` de SAK: captura la firma real de la transacción on-chain al momento de firmar — prueba de la transacción exacta, no solo de la intención.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'La atestación es fire-and-forget: un fallo de Prova jamás rompe ni ralentiza la acción del agente. Los errores van a `onError` (default: warning por consola).',
      },
      { kind: 'h2', text: 'Instalar' },
      { kind: 'code', code: installCode },
      {
        kind: 'p',
        text: 'El adapter nunca importa `solana-agent-kit` — se apoya en el tipado estructural de TypeScript, así que sigue siendo una dependencia ligera validada contra SAK v2.',
      },
      { kind: 'h2', text: 'Inicio rápido' },
      { kind: 'code', code: attachCode },
      { kind: 'h2', text: 'Opciones' },
      { kind: 'code', code: optionsCode },
      {
        kind: 'table',
        headers: ['Opción', 'Default', 'Descripción'],
        rows: [
          ['`attester`', '—', 'Puente hacia Prova. Constrúyelo con `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'atesta todo', 'Predicado por nombre de acción — devuelve `false` para saltar una acción.'],
          ['`batch.maxSize`', '`25`', 'Flush inmediato al llegar a N items encolados (1–100 por transacción).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce: flush N ms después de la última acción, así una ráfaga de tool calls cae en UNA transacción. `0` = atestar cada acción de inmediato.'],
          ['`onError`', 'warn por consola', 'Se llama si falla la atestación; la acción del agente nunca se ve afectada.'],
        ],
      },
      { kind: 'h2', text: 'Semántica del batching' },
      {
        kind: 'p',
        text: 'Los agentes multi-tool-calling disparan acciones en ráfagas. El batcher agrupa la ráfaga por debounce: espera `flushDelayMs` tras la última acción y envía todo en una transacción `record_attestations` (hasta 100). Al llegar a `maxSize` hace flush inmediato. `handle.flush()` fuerza el envío; `handle.stop()` hace un flush final garantizado — llámalo siempre al apagar.',
      },
      { kind: 'h2', text: 'Captura a nivel de wallet' },
      { kind: 'code', code: walletCode },
      { kind: 'h2', text: 'Qué se atesta' },
      {
        kind: 'table',
        headers: ['Fuente', 'Payload', 'Tipo de acción'],
        rows: [
          ['Handler de acción', 'Nombre de la acción + input + resultado (hasheado, nunca on-chain).', 'Mapeado desde el nombre de la acción (`ToolCall`, `Transaction`, …).'],
          ['`ProvaWallet`', 'La firma real de la transacción.', '`Transaction`.'],
        ],
      },
    ],
  },
  ZH: {
    title: 'Agent Kit 适配器',
    intro:
      '`prova-agent-kit` 用两行代码将 Prova 接入 Solana Agent Kit v2。代理执行的每个操作都会被捕获、哈希、批量处理并封存在链上 — 无需改动代理逻辑。',
    blocks: [
      { kind: 'h2', text: '如何捕获操作' },
      {
        kind: 'list',
        items: [
          '`attachProva(agent)` 包装每个已注册的操作 handler：handler 完成后，适配器根据操作名称、输入和结果构建负载，进行哈希并将证明加入队列。语义丰富，代码零改动。',
          '`ProvaWallet` 装饰 SAK 的 `BaseWallet`：在签名时捕获真实的链上交易签名 — 证明确切的交易，而不仅仅是意图。',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: '证明是 fire-and-forget 的：Prova 的故障绝不会中断或拖慢代理操作。错误交给 `onError`（默认：控制台警告）。',
      },
      { kind: 'h2', text: '安装' },
      { kind: 'code', code: installCode },
      {
        kind: 'p',
        text: '适配器从不导入 `solana-agent-kit` — 它依赖 TypeScript 结构化类型，因此是一个经 SAK v2 验证的轻量依赖。',
      },
      { kind: 'h2', text: '快速开始' },
      { kind: 'code', code: attachCode },
      { kind: 'h2', text: '选项' },
      { kind: 'code', code: optionsCode },
      {
        kind: 'table',
        headers: ['选项', '默认值', '说明'],
        rows: [
          ['`attester`', '—', '通向 Prova 的桥。用 `attesterFromProvaClient(client, hashAction, operatorKeypair)` 构建。'],
          ['`rules`', '全部证明', '按操作名称过滤 — 返回 `false` 跳过该操作。'],
          ['`batch.maxSize`', '`25`', '队列达到 N 条时立即发送（每笔交易 1–100 条）。'],
          ['`batch.flushDelayMs`', '`1000`', '防抖：最后一个操作后 N 毫秒发送，让一连串工具调用落入同一笔交易。`0` = 每个操作立即证明。'],
          ['`onError`', '控制台警告', '证明失败时调用；代理操作本身绝不受影响。'],
        ],
      },
      { kind: 'h2', text: '批量语义' },
      {
        kind: 'p',
        text: '多工具调用的代理会突发式地触发操作。批处理器通过防抖聚合突发：在最后一个操作后等待 `flushDelayMs`，然后在一笔 `record_attestations` 交易中发送全部（最多 100 条）。达到 `maxSize` 立即发送。`handle.flush()` 强制发送；`handle.stop()` 保证最终发送 — 关闭代理时务必调用。',
      },
      { kind: 'h2', text: '钱包级捕获' },
      { kind: 'code', code: walletCode },
      { kind: 'h2', text: '证明内容' },
      {
        kind: 'table',
        headers: ['来源', '负载', '操作类型'],
        rows: [
          ['操作 handler', '操作名称 + 输入 + 结果（仅哈希，绝不上链）。', '由操作名称映射（`ToolCall`、`Transaction` 等）。'],
          ['`ProvaWallet`', '真实的交易签名。', '`Transaction`。'],
        ],
      },
    ],
  },
};
