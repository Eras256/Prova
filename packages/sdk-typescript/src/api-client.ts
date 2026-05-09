export interface ListAttestationsQuery {
  agentPda?: string;
  actionType?: string;
  /** ISO 8601 date string */
  from?: string;
  /** ISO 8601 date string */
  to?: string;
  limit?: number;
  offset?: number;
}

export interface AttestationResponse {
  pda: string;
  agentPda: string;
  actionType: string;
  actionHash: string;
  timestamp: string;
  blockHeight: number;
  privacyMode: boolean;
  metadataUri: string | null;
  metadata: Record<string, unknown> | null;
  signature: string;
  schemaVersion: number;
}

export interface AgentResponse {
  pda: string;
  operator: string;
  agentId: string;
  policyRoot: string;
  registeredAt: string;
  revoked: boolean;
  attestationCount: number;
  updatedAt: string;
}

export interface AgentStatsResponse {
  agent: AgentResponse;
  totalAttestations: number;
  byType: Record<string, number>;
  recentAttestations: AttestationResponse[];
}

export interface BulkVerifyItem {
  id: string;
  valid: boolean;
  actionType: string | null;
  timestamp: string | null;
  checkedAt: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export interface ProvaApiClientConfig {
  /** Base URL of the Prova API — e.g. https://api.prova.io */
  apiUrl: string;
  /** API key (prova_...). Required for premium endpoints. */
  apiKey?: string;
}

/**
 * HTTP client for the Prova REST API.
 *
 * Use this to query the indexed attestation data without touching Solana directly.
 * For writing attestations on-chain use {@link ProvaClient} instead.
 *
 * @example
 * ```typescript
 * const api = new ProvaApiClient({ apiUrl: 'https://api.prova.io', apiKey: 'prova_...' });
 * const { data, pagination } = await api.listAttestations({ agentPda: '...', limit: 10 });
 * ```
 */
export class ProvaApiClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: ProvaApiClientConfig) {
    this.baseUrl = config.apiUrl.replace(/\/$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'x-api-key': config.apiKey } : {}),
    };
  }

  // ─── Public endpoints (no API key required) ─────────────────────────────────

  async listAttestations(
    query: ListAttestationsQuery = {}
  ): Promise<{ data: AttestationResponse[]; pagination: Pagination }> {
    const params = new URLSearchParams();
    if (query.agentPda) params.set('agentPda', query.agentPda);
    if (query.actionType) params.set('actionType', query.actionType);
    if (query.from) params.set('from', query.from);
    if (query.to) params.set('to', query.to);
    if (query.limit != null) params.set('limit', String(query.limit));
    if (query.offset != null) params.set('offset', String(query.offset));
    const qs = params.toString();
    return this.get(`/api/v1/attestations${qs ? `?${qs}` : ''}`);
  }

  async getAttestation(pda: string): Promise<AttestationResponse> {
    const res = await this.get<{ data: AttestationResponse }>(
      `/api/v1/attestations/${encodeURIComponent(pda)}`
    );
    return res.data;
  }

  async verifyAttestation(
    pda: string
  ): Promise<{ valid: boolean; attestation?: AttestationResponse; error?: string }> {
    try {
      const attestation = await this.getAttestation(pda);
      return { valid: true, attestation };
    } catch (err) {
      return { valid: false, error: err instanceof Error ? err.message : 'Not found' };
    }
  }

  async getAgent(agentId: string): Promise<AgentResponse> {
    const res = await this.get<{ data: AgentResponse }>(
      `/api/v1/agents/${encodeURIComponent(agentId)}`
    );
    return res.data;
  }

  async getAgentStats(agentId: string): Promise<AgentStatsResponse> {
    const res = await this.get<{ data: AgentStatsResponse }>(
      `/api/v1/agents/${encodeURIComponent(agentId)}/stats`
    );
    return res.data;
  }

  // ─── Premium endpoints (API key required) ───────────────────────────────────

  async bulkVerify(ids: string[]): Promise<BulkVerifyItem[]> {
    const res = await this.post<{ data: BulkVerifyItem[] }>('/api/v1/premium/bulk-verify', { ids });
    return res.data;
  }

  async getFullHistory(agentId: string): Promise<{ agent: AgentResponse; data: AttestationResponse[] }> {
    return this.get(`/api/v1/premium/full-history/${encodeURIComponent(agentId)}`);
  }

  async getForensicReport(
    agentId: string
  ): Promise<{ agent: AgentResponse; summary: { totalAttestations: number; recentAttestations: AttestationResponse[]; generatedAt: string } }> {
    const res = await this.get<{ data: { agent: AgentResponse; summary: { totalAttestations: number; recentAttestations: AttestationResponse[]; generatedAt: string } } }>(
      `/api/v1/premium/forensic-report/${encodeURIComponent(agentId)}`
    );
    return res.data;
  }

  // ─── Internals ───────────────────────────────────────────────────────────────

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, { headers: this.headers });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      throw new Error(body.error?.message ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const b = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      throw new Error(b.error?.message ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }
}
