'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@prova/ui';
import { Search } from 'lucide-react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/explorer/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-12 flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by agent ID, attestation ID, or operator address..."
          className="pl-9 bg-surface border-border text-white placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" disabled={!query.trim()}>Search</Button>
    </form>
  );
}
