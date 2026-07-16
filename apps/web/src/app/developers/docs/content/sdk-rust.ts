import type { LocalizedDoc } from './types';

const installCode = `cargo add prova-agent-sdk`;

const setupCode = `use prova_agent_sdk::{ProvaClient, ProvaConfig};
use solana_sdk::signature::Keypair;

let client = ProvaClient::new(
    agent_keypair,
    ProvaConfig {
        rpc_url: "https://api.devnet.solana.com".to_string(),
        program_id: None, // defaults to the Devnet deployment
    },
);`;

const attestCode = `use prova_agent_sdk::{ActionType, AttestParams};

// 1. Hash the action payload (SHA-256 → [u8; 32])
let action_hash = ProvaClient::hash_action(&payload_json);

// 2. Register once per operator
let reg = client.register_agent(&operator_keypair, None).await?;

// 3. Attest a single action
let receipt = client
    .attest(&operator_keypair, action_hash, ActionType::ToolCall, false)
    .await?;
println!("{}", receipt.explorer_url);

// 4. Or batch up to 100 in one transaction
let batch = client
    .batch_attest(&operator_keypair, &[
        AttestParams { action_hash, action_type: ActionType::Decision, privacy_mode: false },
    ])
    .await?;`;

const builderCode = `use prova_agent_sdk::AttestationBuilder;
use serde_json::json;

// Fluent builder
let payload = AttestationBuilder::new()
    .action_type(ActionType::ToolCall)
    .payload(json!({ "tool": "jupiter_swap", "amount": "100" }))
    .metadata(json!({ "session": "abc" }))
    .build()?;

// Or typed factories
let tx  = AttestationBuilder::transaction("5Kd3...sig")?;
let tc  = AttestationBuilder::tool_call("fetch_price", json!({ "pair": "SOL/USDC" }))?;
let inv = AttestationBuilder::model_invocation("claude-fable-5", "prompt-hash")?;`;

const readCode = `// On-chain reads
let account = client.get_agent_account(&operator_pubkey).await?;
let active  = client.is_agent_active(&operator_pubkey).await;
let (pda, bump) = client.derive_agent_pda(&operator_pubkey);

// Lifecycle management
client.update_policy_root(&operator_keypair, new_root).await?;
client.revoke_agent(&operator_keypair).await?;`;

export const sdkRust: LocalizedDoc = {
  EN: {
    title: 'Rust SDK',
    intro:
      'The `prova-agent-sdk` crate brings the full attestation lifecycle to Rust agents: register, attest, batch, revoke — with typed errors and a fluent payload builder. No Anchor client dependency; instructions are built directly.',
    blocks: [
      { kind: 'h2', text: 'Install' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Setup' },
      { kind: 'code', code: setupCode },
      { kind: 'h2', text: 'Attest' },
      { kind: 'code', code: attestCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'All write methods return `Result<_, ProvaError>` — typed errors like `BatchLimitExceeded` instead of panics, matching idiomatic Rust error handling.',
      },
      { kind: 'h2', text: 'Payload builder' },
      { kind: 'code', code: builderCode },
      { kind: 'h2', text: 'Reads & lifecycle' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'API surface' },
      {
        kind: 'table',
        headers: ['Method', 'Description'],
        rows: [
          ['`ProvaClient::new(agent_keypair, config)`', 'Build the client. `ProvaConfig::default()` targets Devnet.'],
          ['`ProvaClient::hash_action(&str) -> [u8; 32]`', 'SHA-256 of the payload string.'],
          ['`register_agent(&operator, policy_root)`', 'Creates the agent PDA. `policy_root: Option<[u8; 32]>`.'],
          ['`attest(&operator, hash, action_type, privacy_mode)`', 'Single attestation.'],
          ['`batch_attest(&operator, &[AttestParams])`', '1–100 attestations in one transaction.'],
          ['`update_policy_root(&operator, new_root)`', 'Rotates the policy Merkle root.'],
          ['`revoke_agent(&operator)`', 'Irreversible kill switch.'],
          ['`get_agent_account(&pubkey)` / `is_agent_active(&pubkey)`', 'Read on-chain state.'],
        ],
      },
    ],
  },
  ES: {
    title: 'SDK Rust',
    intro:
      'El crate `prova-agent-sdk` trae el ciclo de vida completo de atestación a agentes en Rust: registrar, atestar, agrupar, revocar — con errores tipados y un builder fluido de payloads. Sin dependencia del cliente Anchor; las instrucciones se construyen directamente.',
    blocks: [
      { kind: 'h2', text: 'Instalar' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Setup' },
      { kind: 'code', code: setupCode },
      { kind: 'h2', text: 'Atestar' },
      { kind: 'code', code: attestCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Todos los métodos de escritura devuelven `Result<_, ProvaError>` — errores tipados como `BatchLimitExceeded` en vez de panics, siguiendo el manejo de errores idiomático de Rust.',
      },
      { kind: 'h2', text: 'Builder de payloads' },
      { kind: 'code', code: builderCode },
      { kind: 'h2', text: 'Lecturas y ciclo de vida' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'Superficie de la API' },
      {
        kind: 'table',
        headers: ['Método', 'Descripción'],
        rows: [
          ['`ProvaClient::new(agent_keypair, config)`', 'Construye el cliente. `ProvaConfig::default()` apunta a Devnet.'],
          ['`ProvaClient::hash_action(&str) -> [u8; 32]`', 'SHA-256 del string del payload.'],
          ['`register_agent(&operator, policy_root)`', 'Crea la PDA del agente. `policy_root: Option<[u8; 32]>`.'],
          ['`attest(&operator, hash, action_type, privacy_mode)`', 'Atestación individual.'],
          ['`batch_attest(&operator, &[AttestParams])`', '1–100 atestaciones en una transacción.'],
          ['`update_policy_root(&operator, new_root)`', 'Rota la raíz Merkle de política.'],
          ['`revoke_agent(&operator)`', 'Kill switch irreversible.'],
          ['`get_agent_account(&pubkey)` / `is_agent_active(&pubkey)`', 'Lee estado on-chain.'],
        ],
      },
    ],
  },
  ZH: {
    title: 'Rust SDK',
    intro:
      '`prova-agent-sdk` crate 为 Rust 代理提供完整的证明生命周期：注册、证明、批量、撤销 — 带类型化错误和流式负载构建器。不依赖 Anchor 客户端；指令直接构建。',
    blocks: [
      { kind: 'h2', text: '安装' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: '配置' },
      { kind: 'code', code: setupCode },
      { kind: 'h2', text: '证明' },
      { kind: 'code', code: attestCode },
      {
        kind: 'callout',
        tone: 'info',
        text: '所有写入方法返回 `Result<_, ProvaError>` — 类型化错误（如 `BatchLimitExceeded`）而非 panic，符合 Rust 惯用的错误处理。',
      },
      { kind: 'h2', text: '负载构建器' },
      { kind: 'code', code: builderCode },
      { kind: 'h2', text: '读取与生命周期' },
      { kind: 'code', code: readCode },
      { kind: 'h2', text: 'API 一览' },
      {
        kind: 'table',
        headers: ['方法', '说明'],
        rows: [
          ['`ProvaClient::new(agent_keypair, config)`', '构建客户端。`ProvaConfig::default()` 指向 Devnet。'],
          ['`ProvaClient::hash_action(&str) -> [u8; 32]`', '负载字符串的 SHA-256。'],
          ['`register_agent(&operator, policy_root)`', '创建代理 PDA。`policy_root: Option<[u8; 32]>`。'],
          ['`attest(&operator, hash, action_type, privacy_mode)`', '单条证明。'],
          ['`batch_attest(&operator, &[AttestParams])`', '一笔交易 1–100 条证明。'],
          ['`update_policy_root(&operator, new_root)`', '轮换策略 Merkle 根。'],
          ['`revoke_agent(&operator)`', '不可逆的终止开关。'],
          ['`get_agent_account(&pubkey)` / `is_agent_active(&pubkey)`', '读取链上状态。'],
        ],
      },
    ],
  },
};
