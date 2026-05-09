import type { ActionType } from './core';

export interface AttestationPayload {
  actionType: ActionType;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Builder fluido para construir payloads de atestación de forma tipada.
 * Úsalo junto a ProvaClient.hashAction() para producir el action_hash.
 *
 * @example
 * ```typescript
 * const payload = AttestationBuilder.transaction('sig_abc123', { amount: 100, token: 'USDC' });
 * const hash = await ProvaClient.hashAction(JSON.stringify(payload));
 * await prova.attest({ operatorKeypair, actionHash: hash, actionType: 'Transaction' });
 * ```
 */
export class AttestationBuilder {
  private actionType?: ActionType;
  private payload?: Record<string, unknown>;
  private metadata?: Record<string, unknown>;

  setActionType(actionType: ActionType): this {
    this.actionType = actionType;
    return this;
  }

  setPayload(payload: Record<string, unknown>): this {
    this.payload = payload;
    return this;
  }

  setMetadata(metadata: Record<string, unknown>): this {
    this.metadata = metadata;
    return this;
  }

  build(): AttestationPayload {
    if (!this.actionType) throw new Error('actionType is required');
    if (!this.payload) throw new Error('payload is required');
    return { actionType: this.actionType, payload: this.payload, metadata: this.metadata };
  }

  // ─── Factory methods ──────────────────────────────────────────────────────

  /** Atestación de una transacción on-chain. */
  static transaction(txSignature: string, extra?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('Transaction')
      .setPayload({ txSignature, ...extra })
      .build();
  }

  /** Atestación de una llamada a herramienta (tool use). */
  static toolCall(toolName: string, args?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('ToolCall')
      .setPayload({ toolName, args: args ?? {} })
      .build();
  }

  /** Atestación de una invocación de modelo de IA. */
  static modelInvocation(model: string, promptHash: string, extra?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('ModelInvocation')
      .setPayload({ model, promptHash, ...extra })
      .build();
  }

  /** Atestación de una decisión del agente. */
  static decision(choice: string, rationale?: string, extra?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('Decision')
      .setPayload({ choice, rationale: rationale ?? null, ...extra })
      .build();
  }

  /** Atestación de acceso a un recurso externo. */
  static resourceAccess(resource: string, method: string, extra?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('ResourceAccess')
      .setPayload({ resource, method, ...extra })
      .build();
  }

  /** Atestación de una verificación de política. */
  static policyCheck(policy: string, result: 'pass' | 'fail', extra?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('PolicyCheck')
      .setPayload({ policy, result, ...extra })
      .build();
  }

  /** Payload personalizado para tipos no cubiertos por los factory methods. */
  static custom(payload: Record<string, unknown>, metadata?: Record<string, unknown>): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('Custom')
      .setPayload(payload)
      .setMetadata(metadata ?? {})
      .build();
  }
}
