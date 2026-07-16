'use client';
import { useState } from 'react';
import { Button, Input } from '@prova/ui';
import { Loader2, Play, TerminalSquare } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const API_BASE = 'https://prova-api.fly.dev';

interface EndpointDef {
  id: string;
  path: string;
  /** Segmentos :param de la ruta. */
  pathParams: { name: string; placeholder: string }[];
  /** Query params opcionales. */
  queryParams: { name: string; placeholder: string }[];
}

const endpoints: EndpointDef[] = [
  { id: 'stats', path: '/api/v1/stats', pathParams: [], queryParams: [] },
  {
    id: 'attestations',
    path: '/api/v1/attestations',
    pathParams: [],
    queryParams: [
      { name: 'limit', placeholder: '10' },
      { name: 'agentPda', placeholder: '4QxC…' },
      { name: 'actionType', placeholder: 'ToolCall' },
    ],
  },
  {
    id: 'attestation',
    path: '/api/v1/attestations/:id',
    pathParams: [{ name: 'id', placeholder: 'attestation PDA' }],
    queryParams: [],
  },
  {
    id: 'agent',
    path: '/api/v1/agents/:agentId',
    pathParams: [{ name: 'agentId', placeholder: 'agent PDA' }],
    queryParams: [],
  },
  {
    id: 'agentStats',
    path: '/api/v1/agents/:agentId/stats',
    pathParams: [{ name: 'agentId', placeholder: 'agent PDA' }],
    queryParams: [],
  },
  { id: 'health', path: '/api/v1/health', pathParams: [], queryParams: [] },
];

const defaultEndpoint = endpoints[0] as EndpointDef;

const content = {
  EN: {
    title: 'Try it live',
    desc: 'Run real requests against the production API from your browser. Public endpoints need no key; add yours to unlock premium routes.',
    apiKey: 'API key (optional)',
    apiKeyPlaceholder: 'prova_… — never stored, sent only as x-api-key',
    run: 'Run',
    running: 'Running…',
    status: 'Status',
    time: 'Time',
    hint: 'Responses come straight from the live indexer — the same data any auditor would see.',
  },
  ES: {
    title: 'Pruébala en vivo',
    desc: 'Ejecuta requests reales contra la API de producción desde tu navegador. Los endpoints públicos no requieren key; añade la tuya para las rutas premium.',
    apiKey: 'API key (opcional)',
    apiKeyPlaceholder: 'prova_… — nunca se guarda, solo se envía como x-api-key',
    run: 'Ejecutar',
    running: 'Ejecutando…',
    status: 'Estado',
    time: 'Tiempo',
    hint: 'Las respuestas vienen directo del indexer en vivo — los mismos datos que vería cualquier auditor.',
  },
  ZH: {
    title: '在线试用',
    desc: '直接从浏览器对生产 API 发起真实请求。公开端点无需密钥；添加您的密钥可解锁高级路由。',
    apiKey: 'API 密钥（可选）',
    apiKeyPlaceholder: 'prova_… — 绝不存储，仅作为 x-api-key 发送',
    run: '运行',
    running: '运行中…',
    status: '状态',
    time: '耗时',
    hint: '响应直接来自实时索引器 — 与任何审计方看到的数据完全相同。',
  },
};

export function ApiConsole() {
  const { lang } = useI18n();
  const t = content[lang];

  const [selected, setSelected] = useState<EndpointDef>(defaultEndpoint);
  const [values, setValues] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [output, setOutput] = useState<string>('');

  const buildUrl = (): string => {
    let path = selected.path;
    for (const p of selected.pathParams) {
      path = path.replace(`:${p.name}`, encodeURIComponent(values[p.name] ?? ''));
    }
    const search = new URLSearchParams();
    for (const q of selected.queryParams) {
      const v = (values[q.name] ?? '').trim();
      if (v) search.set(q.name, v);
    }
    const qs = search.toString();
    return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
  };

  const missingRequired = selected.pathParams.some((p) => !(values[p.name] ?? '').trim());

  const run = async () => {
    setLoading(true);
    setStatus(null);
    setElapsed(null);
    setOutput('');
    const started = performance.now();
    try {
      const res = await fetch(buildUrl(), {
        headers: apiKey.trim() ? { 'x-api-key': apiKey.trim() } : undefined,
      });
      setStatus(res.status);
      setElapsed(Math.round(performance.now() - started));
      const body = await res.json().catch(() => null);
      setOutput(body ? JSON.stringify(body, null, 2) : await res.text());
    } catch (err) {
      setElapsed(Math.round(performance.now() - started));
      setOutput(err instanceof Error ? err.message : 'network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
          <TerminalSquare className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl uppercase text-white">{t.title}</h2>
      </div>
      <p className="leading-relaxed text-muted-foreground">{t.desc}</p>

      {/* Selector de endpoint */}
      <div className="mt-6 flex flex-wrap gap-2">
        {endpoints.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setSelected(e);
              setStatus(null);
              setOutput('');
            }}
            className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              selected.id === e.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            GET {e.path.replace('/api/v1', '')}
          </button>
        ))}
      </div>

      {/* Parámetros */}
      {(selected.pathParams.length > 0 || selected.queryParams.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...selected.pathParams, ...selected.queryParams].map((p) => (
            <div key={p.name}>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {p.name}
              </label>
              <Input
                value={values[p.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
                placeholder={p.placeholder}
                className="mt-1 font-mono text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* API key + Run */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {t.apiKey}
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t.apiKeyPlaceholder}
            className="mt-1 font-mono text-sm"
            autoComplete="off"
          />
        </div>
        <Button onClick={run} disabled={loading || missingRequired} className="shrink-0">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.running}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> {t.run}
            </>
          )}
        </Button>
      </div>

      {/* URL efectiva */}
      <p className="mt-3 break-all font-mono text-xs text-muted-foreground">GET {buildUrl()}</p>

      {/* Resultado */}
      {(status !== null || output) && (
        <div className="mt-4 border border-border bg-surface">
          <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider">
            {status !== null && (
              <span className={status < 400 ? 'text-primary' : 'text-destructive'}>
                {t.status}: {status}
              </span>
            )}
            {elapsed !== null && (
              <span className="text-muted-foreground">
                {t.time}: {elapsed}ms
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-auto p-4">
            <pre className="font-mono text-xs leading-relaxed text-primary/90 sm:text-sm">
              {output}
            </pre>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t.hint}</p>
    </section>
  );
}
