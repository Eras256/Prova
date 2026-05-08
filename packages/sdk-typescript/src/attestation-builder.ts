import type { ActionType, AttestationPayload } from '@prova/core';
import { ActionTypeSchema } from '@prova/core';

export class AttestationBuilder {
  private actionType?: ActionType;
  private payload?: Record<string, unknown>;
  private metadata?: Record<string, unknown>;

  setActionType(actionType: ActionType): this {
    ActionTypeSchema.parse(actionType);
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

    return {
      actionType: this.actionType,
      payload: this.payload,
      metadata: this.metadata,
    };
  }

  static transaction(
    txSignature: string,
    extra?: Record<string, unknown>
  ): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('Transaction')
      .setPayload({ txSignature, ...extra })
      .build();
  }

  static toolCall(
    toolName: string,
    args?: Record<string, unknown>
  ): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('ToolCall')
      .setPayload({ toolName, args: args ?? {} })
      .build();
  }

  static modelInvocation(
    model: string,
    promptHash: string
  ): AttestationPayload {
    return new AttestationBuilder()
      .setActionType('ModelInvocation')
      .setPayload({ model, promptHash })
      .build();
  }
}
