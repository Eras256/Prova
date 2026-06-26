import { createHash, randomBytes } from 'crypto';
import { AttestationBuilder, type ActionType } from 'prova-agent-sdk';

// Pequeños helpers para generar datos plausibles y variados en cada acción.
const TOKENS = ['USDC', 'SOL', 'BONK', 'JUP', 'WIF', 'JitoSOL'];
const MODELS = ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5'];
const RESOURCES = [
  'https://api.jup.ag/swap/v1/quote',
  'https://api.helius.xyz/v0/transactions',
  'https://price.jup.ag/v6/price',
];
const POLICIES = ['max_slippage_bps', 'daily_volume_limit', 'allowed_token_list'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function fakeSignature(): string {
  return bs58Like(64);
}

// Genera un string base58-ish para simular firmas/hashes sin dependencias extra.
function bs58Like(bytes: number): string {
  return randomBytes(bytes).toString('hex');
}

function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export interface DemoAction {
  actionType: ActionType;
  // El payload se serializa y se hashea para producir el action_hash on-chain.
  payload: ReturnType<typeof AttestationBuilder.transaction>;
  // Descripción legible para logs.
  label: string;
}

/**
 * Construye una acción de agente aleatoria, simulando el comportamiento típico
 * de un bot de DeFi autónomo: swaps, llamadas a herramientas, invocaciones de
 * modelo, decisiones, accesos a recursos y chequeos de política.
 */
export function buildRandomAction(): DemoAction {
  const variants: Array<() => DemoAction> = [
    () => {
      const amount = +(Math.random() * 5000).toFixed(2);
      const token = pick(TOKENS);
      return {
        actionType: 'Transaction',
        payload: AttestationBuilder.transaction(fakeSignature(), { amount, token, venue: 'Jupiter' }),
        label: `swap ${amount} ${token}`,
      };
    },
    () => {
      const token = pick(TOKENS);
      return {
        actionType: 'ToolCall',
        payload: AttestationBuilder.toolCall('jupiter.swapQuote', { inputMint: 'USDC', outputMint: token }),
        label: `toolCall jupiter.swapQuote -> ${token}`,
      };
    },
    () => {
      const model = pick(MODELS);
      return {
        actionType: 'ModelInvocation',
        payload: AttestationBuilder.modelInvocation(model, sha256Hex('prompt-' + Date.now()), { temperature: 0.2 }),
        label: `modelInvocation ${model}`,
      };
    },
    () => {
      const choice = pick(['rebalance', 'hold', 'exit_position', 'increase_exposure']);
      return {
        actionType: 'Decision',
        payload: AttestationBuilder.decision(choice, 'risk score within threshold'),
        label: `decision ${choice}`,
      };
    },
    () => {
      const resource = pick(RESOURCES);
      return {
        actionType: 'ResourceAccess',
        payload: AttestationBuilder.resourceAccess(resource, 'GET'),
        label: `resourceAccess GET ${resource}`,
      };
    },
    () => {
      const policy = pick(POLICIES);
      const result = Math.random() > 0.1 ? 'pass' : 'fail';
      return {
        actionType: 'PolicyCheck',
        payload: AttestationBuilder.policyCheck(policy, result as 'pass' | 'fail'),
        label: `policyCheck ${policy}=${result}`,
      };
    },
  ];

  return pick(variants)();
}
