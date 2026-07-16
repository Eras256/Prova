import type { LocalizedDoc } from './types';

const baseUrlCode = `https://prova-api.fly.dev/api/v1`;

const curlCode = `# List the latest attestations (public, no key required)
curl "https://prova-api.fly.dev/api/v1/attestations?limit=10"

# Filter by agent and action type
curl "https://prova-api.fly.dev/api/v1/attestations?agentPda=4QxC...&actionType=ToolCall"

# Agent detail + stats
curl "https://prova-api.fly.dev/api/v1/agents/4QxC..."
curl "https://prova-api.fly.dev/api/v1/agents/4QxC.../stats"`;

const authCode = `# Premium endpoints require an API key in the x-api-key header:
curl "https://prova-api.fly.dev/api/v1/premium/full-history/4QxC..." \\
  -H "x-api-key: prova_..."`;

const webhookCode = `# Create a webhook (API key required)
curl -X POST "https://prova-api.fly.dev/api/v1/webhooks" \\
  -H "x-api-key: prova_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://your-server.com/hooks/prova", "events": ["attestation.created"] }'

# Deliveries are signed:
#   x-prova-signature: sha256=<HMAC-SHA256 hex of the body>`;

const responseCode = `{
  "data": [
    {
      "pda": "…",
      "agentPda": "4QxC…",
      "actionType": "ToolCall",
      "actionHash": "…",
      "txSignature": "3rJf…",
      "timestamp": "2026-07-15T12:00:00Z"
    }
  ],
  "pagination": { "limit": 10, "offset": 0, "total": 46213 }
}`;

export const apiReference: LocalizedDoc = {
  EN: {
    title: 'REST API',
    intro:
      'The Prova API serves the indexed attestation layer: paginated queries, agent stats, premium forensic endpoints, and webhooks. Public reads need no account.',
    blocks: [
      { kind: 'h2', text: 'Base URL' },
      { kind: 'code', code: baseUrlCode },
      { kind: 'h2', text: 'Public endpoints' },
      {
        kind: 'table',
        headers: ['Endpoint', 'Description'],
        rows: [
          ['`GET /health`', 'Service status and version.'],
          ['`GET /stats`', 'Global agent and attestation counts.'],
          ['`GET /attestations`', 'Paginated list. Query params: `limit`, `offset`, `agentPda`, `actionType`, `from`, `to`.'],
          ['`GET /attestations/:id`', 'Attestation detail by PDA.'],
          ['`GET /agents/:agentId`', 'Agent detail.'],
          ['`GET /agents/:agentId/stats`', 'Per-agent stats with action-type breakdown.'],
        ],
      },
      { kind: 'code', title: 'Examples', code: curlCode },
      { kind: 'code', title: 'Response shape', code: responseCode },
      { kind: 'h2', text: 'Premium endpoints' },
      {
        kind: 'p',
        text: 'Premium endpoints are gated by an API key (header `x-api-key`) and support x402 micropayments for one-off, account-less queries. Generate keys at `theprova.xyz/app/api-keys`.',
      },
      {
        kind: 'table',
        headers: ['Endpoint', 'Description'],
        rows: [
          ['`GET /premium/full-history/:agentId`', 'Full attestation history (up to 1000 receipts).'],
          ['`GET /premium/forensic-report/:agentId`', 'Structured forensic report for audits.'],
          ['`POST /premium/bulk-verify`', 'Verify up to 1000 attestation IDs in one call.'],
        ],
      },
      { kind: 'code', title: 'Authentication', code: authCode },
      { kind: 'h2', text: 'Webhooks' },
      {
        kind: 'p',
        text: 'Get pushed events instead of polling. Deliveries are signed with HMAC-SHA256 (`x-prova-signature` header), retried on failure, and logged.',
      },
      {
        kind: 'table',
        headers: ['Endpoint', 'Description'],
        rows: [
          ['`POST /webhooks`', 'Create a webhook (API key required).'],
          ['`GET /webhooks`', 'List your webhooks (secrets never returned).'],
          ['`DELETE /webhooks/:id`', 'Delete a webhook.'],
        ],
      },
      { kind: 'code', code: webhookCode },
      { kind: 'h2', text: 'Rate limits & errors' },
      {
        kind: 'list',
        items: [
          'Rate limit: 100 requests/minute per IP (sliding window). Exceeding it returns `429`.',
          'Errors follow `{ "error": { "message": string } }` with standard HTTP status codes.',
          'Premium calls without a valid key return `401`; x402-payable requests return `402` with payment instructions.',
        ],
      },
    ],
  },
  ES: {
    title: 'API REST',
    intro:
      'La API de Prova sirve la capa indexada de atestaciones: consultas paginadas, stats de agentes, endpoints forenses premium y webhooks. Las lecturas públicas no requieren cuenta.',
    blocks: [
      { kind: 'h2', text: 'URL base' },
      { kind: 'code', code: baseUrlCode },
      { kind: 'h2', text: 'Endpoints públicos' },
      {
        kind: 'table',
        headers: ['Endpoint', 'Descripción'],
        rows: [
          ['`GET /health`', 'Estado del servicio y versión.'],
          ['`GET /stats`', 'Conteos globales de agentes y atestaciones.'],
          ['`GET /attestations`', 'Lista paginada. Query params: `limit`, `offset`, `agentPda`, `actionType`, `from`, `to`.'],
          ['`GET /attestations/:id`', 'Detalle de atestación por PDA.'],
          ['`GET /agents/:agentId`', 'Detalle de agente.'],
          ['`GET /agents/:agentId/stats`', 'Stats por agente con desglose por tipo de acción.'],
        ],
      },
      { kind: 'code', title: 'Ejemplos', code: curlCode },
      { kind: 'code', title: 'Forma de la respuesta', code: responseCode },
      { kind: 'h2', text: 'Endpoints premium' },
      {
        kind: 'p',
        text: 'Los endpoints premium requieren una API key (header `x-api-key`) y soportan micropagos x402 para consultas one-off sin cuenta. Genera tus keys en `theprova.xyz/app/api-keys`.',
      },
      {
        kind: 'table',
        headers: ['Endpoint', 'Descripción'],
        rows: [
          ['`GET /premium/full-history/:agentId`', 'Historial completo de atestaciones (hasta 1000 recibos).'],
          ['`GET /premium/forensic-report/:agentId`', 'Reporte forense estructurado para auditorías.'],
          ['`POST /premium/bulk-verify`', 'Verifica hasta 1000 IDs de atestación en una llamada.'],
        ],
      },
      { kind: 'code', title: 'Autenticación', code: authCode },
      { kind: 'h2', text: 'Webhooks' },
      {
        kind: 'p',
        text: 'Recibe eventos push en vez de hacer polling. Las entregas van firmadas con HMAC-SHA256 (header `x-prova-signature`), se reintentan si fallan y quedan registradas.',
      },
      {
        kind: 'table',
        headers: ['Endpoint', 'Descripción'],
        rows: [
          ['`POST /webhooks`', 'Crear un webhook (requiere API key).'],
          ['`GET /webhooks`', 'Listar tus webhooks (los secretos nunca se devuelven).'],
          ['`DELETE /webhooks/:id`', 'Eliminar un webhook.'],
        ],
      },
      { kind: 'code', code: webhookCode },
      { kind: 'h2', text: 'Límites de tasa y errores' },
      {
        kind: 'list',
        items: [
          'Límite de tasa: 100 requests/minuto por IP (ventana deslizante). Excederlo devuelve `429`.',
          'Los errores siguen `{ "error": { "message": string } }` con códigos HTTP estándar.',
          'Las llamadas premium sin key válida devuelven `401`; las requests pagables con x402 devuelven `402` con instrucciones de pago.',
        ],
      },
    ],
  },
  ZH: {
    title: 'REST API',
    intro:
      'Prova API 提供索引化的证明层：分页查询、代理统计、高级取证端点和 webhook。公开读取无需账户。',
    blocks: [
      { kind: 'h2', text: '基础 URL' },
      { kind: 'code', code: baseUrlCode },
      { kind: 'h2', text: '公开端点' },
      {
        kind: 'table',
        headers: ['端点', '说明'],
        rows: [
          ['`GET /health`', '服务状态与版本。'],
          ['`GET /stats`', '全局代理和证明计数。'],
          ['`GET /attestations`', '分页列表。查询参数：`limit`、`offset`、`agentPda`、`actionType`、`from`、`to`。'],
          ['`GET /attestations/:id`', '按 PDA 查询证明详情。'],
          ['`GET /agents/:agentId`', '代理详情。'],
          ['`GET /agents/:agentId/stats`', '按操作类型细分的代理统计。'],
        ],
      },
      { kind: 'code', title: '示例', code: curlCode },
      { kind: 'code', title: '响应结构', code: responseCode },
      { kind: 'h2', text: '高级端点' },
      {
        kind: 'p',
        text: '高级端点需要 API 密钥（`x-api-key` 请求头），并支持 x402 微支付以进行免账户的一次性查询。在 `theprova.xyz/app/api-keys` 生成密钥。',
      },
      {
        kind: 'table',
        headers: ['端点', '说明'],
        rows: [
          ['`GET /premium/full-history/:agentId`', '完整证明历史（最多 1000 张收据）。'],
          ['`GET /premium/forensic-report/:agentId`', '用于审计的结构化取证报告。'],
          ['`POST /premium/bulk-verify`', '一次调用验证最多 1000 个证明 ID。'],
        ],
      },
      { kind: 'code', title: '认证', code: authCode },
      { kind: 'h2', text: 'Webhook' },
      {
        kind: 'p',
        text: '接收推送事件而无需轮询。投递使用 HMAC-SHA256 签名（`x-prova-signature` 请求头），失败会重试并留有记录。',
      },
      {
        kind: 'table',
        headers: ['端点', '说明'],
        rows: [
          ['`POST /webhooks`', '创建 webhook（需要 API 密钥）。'],
          ['`GET /webhooks`', '列出您的 webhook（绝不返回密钥）。'],
          ['`DELETE /webhooks/:id`', '删除 webhook。'],
        ],
      },
      { kind: 'code', code: webhookCode },
      { kind: 'h2', text: '速率限制与错误' },
      {
        kind: 'list',
        items: [
          '速率限制：每 IP 每分钟 100 次请求（滑动窗口）。超出返回 `429`。',
          '错误遵循 `{ "error": { "message": string } }`，使用标准 HTTP 状态码。',
          '无有效密钥的高级调用返回 `401`；可用 x402 支付的请求返回 `402` 及支付说明。',
        ],
      },
    ],
  },
};
