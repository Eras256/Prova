// Funciones puras: derivan el payload y el tipo de atestación a partir de la
// acción de SAK y su resultado. Sin efectos secundarios → fáciles de testear.

import type { ActionResult, ProvaActionType } from './types';

const SIGNATURE_KEYS = ['signature', 'txSignature', 'txid', 'tx'] as const;
const DECISION_PATTERN = /decision|choose|select|rebalance|hold|exit|approve|reject/i;

/** Extrae la firma on-chain del result de una acción, si está presente. */
export function extractSignature(result: ActionResult): string | undefined {
  for (const key of SIGNATURE_KEYS) {
    const value = result[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return undefined;
}

/** Mapea el nombre de una acción de SAK al `ActionType` de Prova. */
export function mapActionType(actionName: string, result: ActionResult): ProvaActionType {
  if (extractSignature(result)) return 'Transaction';
  if (DECISION_PATTERN.test(actionName)) return 'Decision';
  return 'ToolCall';
}

/** Construye el objeto que se serializa y hashea para producir el action_hash. */
export function buildPayload(
  actionName: string,
  input: Record<string, unknown>,
  result: ActionResult,
): Record<string, unknown> {
  const signature = extractSignature(result);
  if (signature) {
    return { kind: 'transaction', action: actionName, signature, input };
  }
  return { kind: 'toolCall', action: actionName, input, result };
}
