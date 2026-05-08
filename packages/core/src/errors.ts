export class ProvaError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ProvaError';
  }
}

export class AgentNotFoundError extends ProvaError {
  constructor(agentId: string) {
    super(`Agent not found: ${agentId}`, 'AGENT_NOT_FOUND');
  }
}

export class AgentRevokedError extends ProvaError {
  constructor(agentId: string) {
    super(`Agent has been revoked: ${agentId}`, 'AGENT_REVOKED');
  }
}

export class AttestationNotFoundError extends ProvaError {
  constructor(id: string) {
    super(`Attestation not found: ${id}`, 'ATTESTATION_NOT_FOUND');
  }
}

export class InvalidSignatureError extends ProvaError {
  constructor() {
    super('Invalid cryptographic signature', 'INVALID_SIGNATURE');
  }
}

export class BatchLimitExceededError extends ProvaError {
  constructor(limit: number) {
    super(`Batch size exceeds limit of ${limit}`, 'BATCH_LIMIT_EXCEEDED');
  }
}

export class UnauthorizedError extends ProvaError {
  constructor(action: string) {
    super(`Unauthorized to perform action: ${action}`, 'UNAUTHORIZED');
  }
}
