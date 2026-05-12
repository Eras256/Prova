'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@prova/ui';
import { Search, Loader2 } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { useI18n } from '../i18n-provider';

type DetectedKind = 'signature' | 'pubkey' | 'unknown';

function detect(q: string): DetectedKind {
  const trimmed = q.trim();
  // Las firmas de Solana son base58 de ~88 chars, las pubkeys ~32-44 chars
  if (trimmed.length >= 80) return 'signature';
  try {
    new PublicKey(trimmed);
    return 'pubkey';
  } catch {
    return 'unknown';
  }
}

const content = {
  EN: {
    placeholder: 'Search by transaction signature, agent pubkey, or operator address…',
    searchBtn: 'Search',
    loadingBtn: 'Loading…',
    detected: 'detected:'
  },
  ES: {
    placeholder: 'Buscar por firma de transacción, pubkey de agente o dirección de operador…',
    searchBtn: 'Buscar',
    loadingBtn: 'Cargando…',
    detected: 'detectado:'
  },
  ZH: {
    placeholder: '通过交易签名、代理公钥或操作员地址搜索…',
    searchBtn: '搜索',
    loadingBtn: '加载中…',
    detected: '检测到：'
  }
};

export function SearchInput() {
  const { lang } = useI18n();
  const t = content[lang];
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const kind = query.trim() ? detect(query) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const k = detect(q);
    startTransition(() => {
      if (k === 'signature') router.push(`/explorer/tx/${encodeURIComponent(q)}`);
      else if (k === 'pubkey') router.push(`/explorer/agent/${encodeURIComponent(q)}`);
      else router.push(`/explorer/search?q=${encodeURIComponent(q)}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="mb-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="border-border bg-background pl-10 font-mono text-sm placeholder:text-muted-foreground"
            disabled={isPending}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!query.trim() || isPending} 
          className="font-mono uppercase tracking-wider gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t.loadingBtn : t.searchBtn}
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {kind && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.detected} <span className="text-foreground">{kind}</span>
          </span>
        )}
      </div>
    </form>
  );
}
