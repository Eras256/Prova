// Puente entre el `ProvaClient` real (prova-agent-sdk) y la interfaz
// `ProvaAttester` que usa el adapter. Tipado estructural → no importamos el SDK.

import type { AttestationItem, ProvaActionType, ProvaAttester } from './types';

/** Forma estructural del `ProvaClient` que necesitamos (de prova-agent-sdk). */
export interface ProvaClientLike {
  attest(args: {
    operatorKeypair: unknown;
    actionHash: Uint8Array;
    actionType: ProvaActionType;
    privacyMode?: boolean;
  }): Promise<{ txSignature: string }>;
  batchAttest(args: {
    operatorKeypair: unknown;
    attestations: Array<{ actionHash: Uint8Array; actionType: ProvaActionType; privacyMode?: boolean }>;
  }): Promise<{ txSignature: string }>;
}

/**
 * Construye un `ProvaAttester` a partir de un `ProvaClient` real, la función
 * estática `ProvaClient.hashAction` y la keypair operadora de Prova.
 *
 * @example
 * const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);
 */
export function attesterFromProvaClient(
  client: ProvaClientLike,
  hashAction: (payload: string) => Promise<Uint8Array>,
  operatorKeypair: unknown,
): ProvaAttester {
  return {
    hashAction,
    attest: (item: AttestationItem) =>
      client.attest({
        operatorKeypair,
        actionHash: item.actionHash,
        actionType: item.actionType,
        privacyMode: item.privacyMode,
      }),
    batchAttest: (items: AttestationItem[]) =>
      client.batchAttest({ operatorKeypair, attestations: items }),
  };
}
