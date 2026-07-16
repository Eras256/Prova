import type { LocalizedDoc } from './types';

const programIdCode = `Program ID (Devnet): G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1
PDA seed:            "prova_agent" + operator_pubkey
Framework:           Anchor 0.31 · Solana CLI 2.1
License:             Apache 2.0 (open source)`;

const accountCode = `#[account]
pub struct AgentAccount {
    pub operator: Pubkey,          // accountable wallet
    pub agent_id: [u8; 32],        // agent identity (pubkey bytes)
    pub policy_root: [u8; 32],     // Merkle root of the operator's policy
    pub attestation_count: u64,    // lifetime counter
    pub created_at: i64,
    pub revoked: bool,             // kill switch flag
    pub bump: u8,
}`;

export const program: LocalizedDoc = {
  EN: {
    title: 'On-chain Program',
    intro:
      'Prova runs on its own Anchor program with native Ed25519 verification — not on a generic attestation service. Four instructions, four events, and a deliberately minimal account model.',
    blocks: [
      { kind: 'h2', text: 'Deployment' },
      { kind: 'code', code: programIdCode },
      { kind: 'h2', text: 'Account model' },
      {
        kind: 'p',
        text: 'One PDA per operator. Attestations themselves are not stored as accounts — they are emitted as events anchored in the transaction (see Core Concepts → Storage model).',
      },
      { kind: 'code', code: accountCode },
      { kind: 'h2', text: 'Instructions' },
      {
        kind: 'table',
        headers: ['Instruction', 'Arguments', 'Effect'],
        rows: [
          ['`register_agent`', '`agent_id: [u8;32]`, `policy_root: [u8;32]`', 'Initializes the agent PDA. Operator signs and pays rent.'],
          ['`record_attestations`', '`attestations: Vec<AttestationInput>`', 'Seals 1–100 attestations. Requires an Ed25519 verification instruction in the same transaction (checked via the instructions sysvar). Emits one `AttestationIssued` per entry.'],
          ['`revoke_agent`', '—', 'Sets `revoked = true`. Irreversible; a revoked agent can no longer attest.'],
          ['`update_policy_root`', '`new_root: [u8;32]`', 'Rotates the policy Merkle root. Emits `PolicyRootUpdated`.'],
        ],
      },
      { kind: 'h2', text: 'Ed25519 verification' },
      {
        kind: 'p',
        text: 'Signatures are verified by the Solana runtime itself: the client prepends an instruction to the native Ed25519 program, and `record_attestations` inspects the instructions sysvar to confirm the signature over each `action_hash` was verified in the same transaction. This is cheaper and safer than in-program signature math.',
      },
      { kind: 'h2', text: 'Events' },
      {
        kind: 'table',
        headers: ['Event', 'Emitted on'],
        rows: [
          ['`AgentRegistered`', '`register_agent`'],
          ['`AttestationIssued`', 'each entry of `record_attestations`'],
          ['`AgentRevokedEvent`', '`revoke_agent`'],
          ['`PolicyRootUpdated`', '`update_policy_root`'],
        ],
      },
      { kind: 'h2', text: 'Errors' },
      {
        kind: 'table',
        headers: ['Error', 'Cause'],
        rows: [
          ['`AgentRevoked`', 'The agent was revoked and tried to attest.'],
          ['`UnauthorizedOperator`', 'The signer is not the operator that owns the PDA.'],
          ['`InvalidSignature`', 'Missing or mismatched Ed25519 verification for an `action_hash`.'],
          ['`EmptyBatch`', '`record_attestations` called with zero entries.'],
          ['`BatchLimitExceeded`', 'More than 100 attestations in one call.'],
          ['`InvalidPolicyRoot`', 'Malformed policy root.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'The program source lives in `packages/program` of the public repo (`github.com/Eras256/Prova`) — audits and PRs welcome.',
      },
    ],
  },
  ES: {
    title: 'Programa on-chain',
    intro:
      'Prova corre sobre su propio programa Anchor con verificación Ed25519 nativa — no sobre un servicio genérico de atestación. Cuatro instrucciones, cuatro eventos y un modelo de cuentas deliberadamente mínimo.',
    blocks: [
      { kind: 'h2', text: 'Despliegue' },
      { kind: 'code', code: programIdCode },
      { kind: 'h2', text: 'Modelo de cuentas' },
      {
        kind: 'p',
        text: 'Una PDA por operador. Las atestaciones no se almacenan como cuentas — se emiten como eventos anclados en la transacción (ver Conceptos clave → Modelo de almacenamiento).',
      },
      { kind: 'code', code: accountCode },
      { kind: 'h2', text: 'Instrucciones' },
      {
        kind: 'table',
        headers: ['Instrucción', 'Argumentos', 'Efecto'],
        rows: [
          ['`register_agent`', '`agent_id: [u8;32]`, `policy_root: [u8;32]`', 'Inicializa la PDA del agente. El operador firma y paga el rent.'],
          ['`record_attestations`', '`attestations: Vec<AttestationInput>`', 'Sella 1–100 atestaciones. Requiere una instrucción de verificación Ed25519 en la misma transacción (comprobada vía el instructions sysvar). Emite un `AttestationIssued` por entrada.'],
          ['`revoke_agent`', '—', 'Pone `revoked = true`. Irreversible; un agente revocado ya no puede atestar.'],
          ['`update_policy_root`', '`new_root: [u8;32]`', 'Rota la raíz Merkle de política. Emite `PolicyRootUpdated`.'],
        ],
      },
      { kind: 'h2', text: 'Verificación Ed25519' },
      {
        kind: 'p',
        text: 'Las firmas las verifica el propio runtime de Solana: el cliente antepone una instrucción al programa nativo Ed25519, y `record_attestations` inspecciona el instructions sysvar para confirmar que la firma sobre cada `action_hash` fue verificada en la misma transacción. Es más barato y seguro que hacer la criptografía dentro del programa.',
      },
      { kind: 'h2', text: 'Eventos' },
      {
        kind: 'table',
        headers: ['Evento', 'Se emite en'],
        rows: [
          ['`AgentRegistered`', '`register_agent`'],
          ['`AttestationIssued`', 'cada entrada de `record_attestations`'],
          ['`AgentRevokedEvent`', '`revoke_agent`'],
          ['`PolicyRootUpdated`', '`update_policy_root`'],
        ],
      },
      { kind: 'h2', text: 'Errores' },
      {
        kind: 'table',
        headers: ['Error', 'Causa'],
        rows: [
          ['`AgentRevoked`', 'El agente fue revocado e intentó atestar.'],
          ['`UnauthorizedOperator`', 'El firmante no es el operador dueño de la PDA.'],
          ['`InvalidSignature`', 'Verificación Ed25519 ausente o no coincidente para un `action_hash`.'],
          ['`EmptyBatch`', '`record_attestations` llamado con cero entradas.'],
          ['`BatchLimitExceeded`', 'Más de 100 atestaciones en una llamada.'],
          ['`InvalidPolicyRoot`', 'Raíz de política malformada.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'El código del programa vive en `packages/program` del repo público (`github.com/Eras256/Prova`) — auditorías y PRs bienvenidos.',
      },
    ],
  },
  ZH: {
    title: '链上程序',
    intro:
      'Prova 运行在自有的 Anchor 程序上，具备原生 Ed25519 验证 — 而非通用证明服务。四条指令、四个事件，以及刻意精简的账户模型。',
    blocks: [
      { kind: 'h2', text: '部署信息' },
      { kind: 'code', code: programIdCode },
      { kind: 'h2', text: '账户模型' },
      {
        kind: 'p',
        text: '每个操作员一个 PDA。证明本身不以账户形式存储 — 而是作为锚定在交易中的事件发出（见核心概念 → 存储模型）。',
      },
      { kind: 'code', code: accountCode },
      { kind: 'h2', text: '指令' },
      {
        kind: 'table',
        headers: ['指令', '参数', '作用'],
        rows: [
          ['`register_agent`', '`agent_id: [u8;32]`、`policy_root: [u8;32]`', '初始化代理 PDA。操作员签名并支付租金。'],
          ['`record_attestations`', '`attestations: Vec<AttestationInput>`', '封存 1–100 条证明。要求同一交易中包含 Ed25519 验证指令（通过 instructions sysvar 检查）。每条发出一个 `AttestationIssued`。'],
          ['`revoke_agent`', '—', '设置 `revoked = true`。不可逆；被撤销的代理无法再证明。'],
          ['`update_policy_root`', '`new_root: [u8;32]`', '轮换策略 Merkle 根。发出 `PolicyRootUpdated`。'],
        ],
      },
      { kind: 'h2', text: 'Ed25519 验证' },
      {
        kind: 'p',
        text: '签名由 Solana 运行时本身验证：客户端在交易前部添加一条指向原生 Ed25519 程序的指令，`record_attestations` 检查 instructions sysvar，确认每个 `action_hash` 的签名已在同一交易中得到验证。这比在程序内做签名运算更便宜、更安全。',
      },
      { kind: 'h2', text: '事件' },
      {
        kind: 'table',
        headers: ['事件', '触发时机'],
        rows: [
          ['`AgentRegistered`', '`register_agent`'],
          ['`AttestationIssued`', '`record_attestations` 的每条记录'],
          ['`AgentRevokedEvent`', '`revoke_agent`'],
          ['`PolicyRootUpdated`', '`update_policy_root`'],
        ],
      },
      { kind: 'h2', text: '错误' },
      {
        kind: 'table',
        headers: ['错误', '原因'],
        rows: [
          ['`AgentRevoked`', '代理已被撤销却尝试证明。'],
          ['`UnauthorizedOperator`', '签名者不是拥有该 PDA 的操作员。'],
          ['`InvalidSignature`', '某个 `action_hash` 的 Ed25519 验证缺失或不匹配。'],
          ['`EmptyBatch`', '`record_attestations` 以零条记录调用。'],
          ['`BatchLimitExceeded`', '单次调用超过 100 条证明。'],
          ['`InvalidPolicyRoot`', '策略根格式错误。'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: '程序源码位于公开仓库（`github.com/Eras256/Prova`）的 `packages/program` — 欢迎审计和 PR。',
      },
    ],
  },
};
