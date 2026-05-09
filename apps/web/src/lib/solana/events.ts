import { PublicKey } from '@solana/web3.js';

export type ActionType =
  | 'transaction'
  | 'decision'
  | 'modelInvocation'
  | 'toolCall'
  | 'resourceAccess'
  | 'policyCheck'
  | 'custom';

export type AttestationIssued = {
  agent: PublicKey;
  agentId: Uint8Array;
  actionType: ActionType;
  actionHash: Uint8Array;
  privacyMode: boolean;
  timestamp: number;
  signature: Uint8Array;
};

export type DecodedEvent =
  | { name: 'AttestationIssued'; data: AttestationIssued }
  | { name: 'AgentRegistered'; data: { agent: PublicKey; operator: PublicKey; agentId: Uint8Array; timestamp: number } }
  | { name: 'AgentRevokedEvent'; data: { agent: PublicKey; operator: PublicKey; timestamp: number } }
  | { name: 'PolicyRootUpdated'; data: { agent: PublicKey; operator: PublicKey; newRoot: Uint8Array; timestamp: number } };

// Discriminadores Anchor: sha256("event:<EventName>")[0..8]
// Calculados y hardcodeados para evitar depender del coder en runtime.
const DISC: Record<string, Uint8Array> = {
  AttestationIssued:  new Uint8Array([173, 237,  90, 123, 155, 224, 231, 242]),
  AgentRegistered:    new Uint8Array([191,  78, 217,  54, 232, 100, 189,  85]),
  AgentRevokedEvent:  new Uint8Array([218, 156, 242, 182,  58,  95, 202, 161]),
  PolicyRootUpdated:  new Uint8Array([194, 120,  18, 146, 205,  54,  53, 217]),
};

const ACTION_TYPE_VARIANTS: ActionType[] = [
  'transaction',
  'decision',
  'modelInvocation',
  'toolCall',
  'resourceAccess',
  'policyCheck',
  'custom',
];

// Anchor emite eventos como "Program data: <base64>" en los logs de transacción.
export function decodeEventsFromLogs(logs: readonly string[]): DecodedEvent[] {
  const out: DecodedEvent[] = [];
  for (const log of logs) {
    if (!log.startsWith('Program data: ')) continue;
    const b64 = log.slice('Program data: '.length);
    try {
      const bytes = base64ToBytes(b64);
      if (bytes.length < 8) continue;
      const disc = bytes.slice(0, 8);
      const payload = bytes.slice(8);

      if (matchDisc(disc, DISC['AttestationIssued']!)) {
        out.push({ name: 'AttestationIssued', data: parseAttestationIssued(payload) });
      } else if (matchDisc(disc, DISC['AgentRegistered']!)) {
        out.push({ name: 'AgentRegistered', data: parseAgentRegistered(payload) });
      } else if (matchDisc(disc, DISC['AgentRevokedEvent']!)) {
        out.push({ name: 'AgentRevokedEvent', data: parseAgentRevoked(payload) });
      } else if (matchDisc(disc, DISC['PolicyRootUpdated']!)) {
        out.push({ name: 'PolicyRootUpdated', data: parsePolicyRootUpdated(payload) });
      }
    } catch {
      // Log no parseable — saltar silenciosamente
    }
  }
  return out;
}

// Borsh layout de AttestationIssued:
//   agent:       [0..32]   Pubkey
//   agent_id:    [32..64]  [u8;32]
//   action_type: [64]      u8 (enum variant)
//   action_hash: [65..97]  [u8;32]
//   privacy_mode:[97]      bool (u8)
//   timestamp:   [98..106] i64 LE
//   signature:   [106..170] [u8;64]
function parseAttestationIssued(p: Uint8Array): AttestationIssued {
  if (p.length < 170) throw new Error('AttestationIssued payload too short');
  return {
    agent:       new PublicKey(p.slice(0, 32)),
    agentId:     p.slice(32, 64),
    actionType:  ACTION_TYPE_VARIANTS[p[64]!] ?? 'custom',
    actionHash:  p.slice(65, 97),
    privacyMode: p[97] !== 0,
    timestamp:   readI64LE(p, 98),
    signature:   p.slice(106, 170),
  };
}

function parseAgentRegistered(p: Uint8Array) {
  // agent: [0..32], operator: [32..64], agent_id: [64..96], timestamp: [96..104]
  if (p.length < 104) throw new Error('AgentRegistered payload too short');
  return {
    agent:     new PublicKey(p.slice(0, 32)),
    operator:  new PublicKey(p.slice(32, 64)),
    agentId:   p.slice(64, 96),
    timestamp: readI64LE(p, 96),
  };
}

function parseAgentRevoked(p: Uint8Array) {
  // agent: [0..32], operator: [32..64], timestamp: [64..72]
  if (p.length < 72) throw new Error('AgentRevoked payload too short');
  return {
    agent:     new PublicKey(p.slice(0, 32)),
    operator:  new PublicKey(p.slice(32, 64)),
    timestamp: readI64LE(p, 64),
  };
}

function parsePolicyRootUpdated(p: Uint8Array) {
  // agent: [0..32], operator: [32..64], new_root: [64..96], timestamp: [96..104]
  if (p.length < 104) throw new Error('PolicyRootUpdated payload too short');
  return {
    agent:     new PublicKey(p.slice(0, 32)),
    operator:  new PublicKey(p.slice(32, 64)),
    newRoot:   p.slice(64, 96),
    timestamp: readI64LE(p, 96),
  };
}

// --- helpers ---

function matchDisc(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = 0; i < 8; i++) if (a[i] !== b[i]) return false;
  return true;
}

function readI64LE(buf: Uint8Array, offset: number): number {
  const lo = buf[offset]! | (buf[offset+1]! << 8) | (buf[offset+2]! << 16) | (buf[offset+3]! << 24);
  const hi = buf[offset+4]! | (buf[offset+5]! << 8) | (buf[offset+6]! << 16) | (buf[offset+7]! << 24);
  // Para timestamps de Solana los valores caben en un JS number (segundos epoch)
  return hi * 0x100000000 + (lo >>> 0);
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_MAP = new Uint8Array(256).fill(255);
for (let i = 0; i < BASE64_CHARS.length; i++) BASE64_MAP[BASE64_CHARS.charCodeAt(i)] = i;

function base64ToBytes(b64: string): Uint8Array {
  // Eliminar whitespace y padding
  const s = b64.replace(/[\s=]/g, '');
  const len = (s.length * 3) >> 2;
  const out = new Uint8Array(len);
  let j = 0;
  for (let i = 0; i < s.length; i += 4) {
    const a = BASE64_MAP[s.charCodeAt(i)]!;
    const b = BASE64_MAP[s.charCodeAt(i+1)]!;
    const c = BASE64_MAP[s.charCodeAt(i+2) || 65]!;
    const d = BASE64_MAP[s.charCodeAt(i+3) || 65]!;
    if (j < len) out[j++] = (a << 2) | (b >> 4);
    if (j < len) out[j++] = ((b & 0xf) << 4) | (c >> 2);
    if (j < len) out[j++] = ((c & 0x3) << 6) | d;
  }
  return out.slice(0, j);
}

// --- exports de utilidad ---

export function shortPubkey(pk: PublicKey | string, head = 4, tail = 4): string {
  const s = typeof pk === 'string' ? pk : pk.toBase58();
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export function shortBytes(b: Uint8Array, head = 4, tail = 4): string {
  const hex = Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, head * 2)}…${hex.slice(-tail * 2)}`;
}

export const ACTION_TYPE_LABEL: Record<ActionType, string> = {
  transaction:    'Transaction',
  decision:       'Decision',
  modelInvocation:'Model Invocation',
  toolCall:       'Tool Call',
  resourceAccess: 'Resource Access',
  policyCheck:    'Policy Check',
  custom:         'Custom',
};
