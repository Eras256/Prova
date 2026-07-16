import type { LocalizedDoc } from './types';

const claudeCodeCode = `claude mcp add prova -- npx -y prova-mcp-server`;

const jsonConfigCode = `{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"]
    }
  }
}`;

const envConfigCode = `{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"],
      "env": {
        "PROVA_API_KEY": "prova_...",
        "PROVA_API_URL": "https://prova-api.fly.dev"
      }
    }
  }
}`;

export const mcpServer: LocalizedDoc = {
  EN: {
    title: 'MCP Server',
    intro:
      'The official Prova MCP server (`prova-mcp-server`) connects Claude, Cursor, and any Model Context Protocol client to the attestation layer. Your assistant can ask "what did agent X do on Tuesday?" and get verifiable on-chain answers — no explorer tab needed.',
    blocks: [
      { kind: 'h2', text: 'What it is' },
      {
        kind: 'p',
        text: 'A read-only MCP server over stdio. It queries the public Prova REST API (the indexed projection of the on-chain program) and verifies hashes locally. It never holds keys, never signs, never moves funds. Node.js 18+ is the only requirement — `npx` handles the rest.',
      },
      { kind: 'h2', text: 'Setup' },
      { kind: 'h3', text: 'Claude Code' },
      { kind: 'code', code: claudeCodeCode },
      { kind: 'h3', text: 'Claude Desktop' },
      {
        kind: 'p',
        text: 'Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):',
      },
      { kind: 'code', code: jsonConfigCode },
      { kind: 'h3', text: 'Cursor' },
      {
        kind: 'p',
        text: 'Add the same block to `.cursor/mcp.json` (per project) or `~/.cursor/mcp.json` (global). Any other MCP-compatible client works identically — the server speaks standard MCP over stdio.',
      },
      { kind: 'h2', text: 'Tools' },
      {
        kind: 'table',
        headers: ['Tool', 'What it answers'],
        rows: [
          ['`get_stats`', '"How many agents and attestations does the network have?"'],
          ['`list_attestations`', '"What did agent X do this week?" — filters by agent, action type, date range.'],
          ['`get_attestation`', '"Show me receipt Y" — hash, type, signature, timestamp.'],
          ['`get_agent`', '"Who operates agent X? Is it revoked?"'],
          ['`get_agent_stats`', '"What does this agent do most — swaps or tool calls?"'],
          ['`verify_action_hash`', '"Does this payload match the on-chain receipt?" — recomputes SHA-256 locally and compares.'],
          ['`get_full_history`', 'Premium: complete history, up to 1000 receipts.'],
          ['`get_forensic_report`', 'Premium: structured report for audits/compliance.'],
          ['`bulk_verify`', 'Premium: verify up to 1000 receipt PDAs at once.'],
        ],
      },
      { kind: 'h2', text: 'Configuration' },
      {
        kind: 'table',
        headers: ['Env variable', 'Default', 'Purpose'],
        rows: [
          ['`PROVA_API_URL`', '`https://prova-api.fly.dev`', 'Prova REST API base URL.'],
          ['`PROVA_API_KEY`', '—', 'Optional `prova_…` key. Unlocks the three premium tools. Generate at `theprova.xyz/app/api-keys`.'],
        ],
      },
      { kind: 'code', title: 'With premium key', code: envConfigCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Without a key, the six public tools work fully. The premium tools respond with a clear setup instruction instead of failing silently.',
      },
      { kind: 'h2', text: 'Why this matters' },
      {
        kind: 'p',
        text: 'LLMs answering questions about agent behavior usually rely on the operator\'s logs — exactly the thing Prova distrusts by design. With MCP, the model reads the cryptographic record: every answer can cite an on-chain transaction anyone can check.',
      },
    ],
  },
  ES: {
    title: 'Servidor MCP',
    intro:
      'El servidor MCP oficial de Prova (`prova-mcp-server`) conecta Claude, Cursor y cualquier cliente de Model Context Protocol con la capa de atestaciones. Tu asistente puede preguntar "¿qué hizo el agente X el martes?" y recibir respuestas on-chain verificables — sin abrir el explorer.',
    blocks: [
      { kind: 'h2', text: 'Qué es' },
      {
        kind: 'p',
        text: 'Un servidor MCP de solo lectura sobre stdio. Consulta la API REST pública de Prova (la proyección indexada del programa on-chain) y verifica hashes localmente. Nunca retiene claves, nunca firma, nunca mueve fondos. Solo requiere Node.js 18+ — `npx` hace el resto.',
      },
      { kind: 'h2', text: 'Configuración' },
      { kind: 'h3', text: 'Claude Code' },
      { kind: 'code', code: claudeCodeCode },
      { kind: 'h3', text: 'Claude Desktop' },
      {
        kind: 'p',
        text: 'Agrega a `claude_desktop_config.json` (Settings → Developer → Edit Config):',
      },
      { kind: 'code', code: jsonConfigCode },
      { kind: 'h3', text: 'Cursor' },
      {
        kind: 'p',
        text: 'Agrega el mismo bloque a `.cursor/mcp.json` (por proyecto) o `~/.cursor/mcp.json` (global). Cualquier otro cliente compatible con MCP funciona igual — el servidor habla MCP estándar por stdio.',
      },
      { kind: 'h2', text: 'Tools' },
      {
        kind: 'table',
        headers: ['Tool', 'Qué responde'],
        rows: [
          ['`get_stats`', '"¿Cuántos agentes y atestaciones tiene la red?"'],
          ['`list_attestations`', '"¿Qué hizo el agente X esta semana?" — filtra por agente, tipo de acción y rango de fechas.'],
          ['`get_attestation`', '"Muéstrame el recibo Y" — hash, tipo, firma, timestamp.'],
          ['`get_agent`', '"¿Quién opera el agente X? ¿Está revocado?"'],
          ['`get_agent_stats`', '"¿Qué hace más este agente — swaps o tool calls?"'],
          ['`verify_action_hash`', '"¿Este payload corresponde al recibo on-chain?" — recomputa el SHA-256 localmente y compara.'],
          ['`get_full_history`', 'Premium: historial completo, hasta 1000 recibos.'],
          ['`get_forensic_report`', 'Premium: reporte estructurado para auditorías/compliance.'],
          ['`bulk_verify`', 'Premium: verifica hasta 1000 PDAs de recibos de una vez.'],
        ],
      },
      { kind: 'h2', text: 'Variables de entorno' },
      {
        kind: 'table',
        headers: ['Variable', 'Default', 'Propósito'],
        rows: [
          ['`PROVA_API_URL`', '`https://prova-api.fly.dev`', 'URL base de la API REST de Prova.'],
          ['`PROVA_API_KEY`', '—', 'Key `prova_…` opcional. Desbloquea las tres tools premium. Genérala en `theprova.xyz/app/api-keys`.'],
        ],
      },
      { kind: 'code', title: 'Con key premium', code: envConfigCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Sin key, las seis tools públicas funcionan al completo. Las premium responden con una instrucción clara de configuración en vez de fallar en silencio.',
      },
      { kind: 'h2', text: 'Por qué importa' },
      {
        kind: 'p',
        text: 'Los LLMs que responden sobre el comportamiento de agentes suelen apoyarse en los logs del operador — justo aquello de lo que Prova desconfía por diseño. Con MCP, el modelo lee el registro criptográfico: cada respuesta puede citar una transacción on-chain que cualquiera puede comprobar.',
      },
    ],
  },
  ZH: {
    title: 'MCP 服务器',
    intro:
      'Prova 官方 MCP 服务器（`prova-mcp-server`）将 Claude、Cursor 和任何 Model Context Protocol 客户端连接到证明层。您的助手可以问"代理 X 周二做了什么？"并获得可验证的链上答案 — 无需打开浏览器。',
    blocks: [
      { kind: 'h2', text: '它是什么' },
      {
        kind: 'p',
        text: '一个基于 stdio 的只读 MCP 服务器。它查询 Prova 公共 REST API（链上程序的索引投影）并在本地验证哈希。它从不持有密钥、从不签名、从不动用资金。唯一要求是 Node.js 18+ — 其余交给 `npx`。',
      },
      { kind: 'h2', text: '配置' },
      { kind: 'h3', text: 'Claude Code' },
      { kind: 'code', code: claudeCodeCode },
      { kind: 'h3', text: 'Claude Desktop' },
      {
        kind: 'p',
        text: '添加到 `claude_desktop_config.json`（Settings → Developer → Edit Config）：',
      },
      { kind: 'code', code: jsonConfigCode },
      { kind: 'h3', text: 'Cursor' },
      {
        kind: 'p',
        text: '将同一配置块添加到 `.cursor/mcp.json`（项目级）或 `~/.cursor/mcp.json`（全局）。任何其他兼容 MCP 的客户端用法相同 — 服务器通过 stdio 使用标准 MCP。',
      },
      { kind: 'h2', text: '工具' },
      {
        kind: 'table',
        headers: ['工具', '回答的问题'],
        rows: [
          ['`get_stats`', '"网络有多少代理和证明？"'],
          ['`list_attestations`', '"代理 X 本周做了什么？" — 按代理、操作类型、日期范围过滤。'],
          ['`get_attestation`', '"给我看收据 Y" — 哈希、类型、签名、时间戳。'],
          ['`get_agent`', '"谁在运营代理 X？它被撤销了吗？"'],
          ['`get_agent_stats`', '"这个代理最常做什么 — swap 还是工具调用？"'],
          ['`verify_action_hash`', '"这个负载与链上收据匹配吗？" — 本地重新计算 SHA-256 并比对。'],
          ['`get_full_history`', '高级：完整历史，最多 1000 张收据。'],
          ['`get_forensic_report`', '高级：用于审计/合规的结构化报告。'],
          ['`bulk_verify`', '高级：一次验证最多 1000 个收据 PDA。'],
        ],
      },
      { kind: 'h2', text: '环境变量' },
      {
        kind: 'table',
        headers: ['变量', '默认值', '用途'],
        rows: [
          ['`PROVA_API_URL`', '`https://prova-api.fly.dev`', 'Prova REST API 基础 URL。'],
          ['`PROVA_API_KEY`', '—', '可选的 `prova_…` 密钥。解锁三个高级工具。在 `theprova.xyz/app/api-keys` 生成。'],
        ],
      },
      { kind: 'code', title: '带高级密钥', code: envConfigCode },
      {
        kind: 'callout',
        tone: 'info',
        text: '没有密钥时，六个公开工具完全可用。高级工具会返回清晰的配置说明，而不是静默失败。',
      },
      { kind: 'h2', text: '为什么重要' },
      {
        kind: 'p',
        text: '回答代理行为问题的 LLM 通常依赖操作员的日志 — 而这正是 Prova 从设计上就不信任的东西。通过 MCP，模型读取的是加密记录：每个答案都可以引用任何人都能核验的链上交易。',
      },
    ],
  },
};
