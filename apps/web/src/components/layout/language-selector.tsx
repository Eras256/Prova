'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@prova/ui';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n, type Language } from '../i18n-provider';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'ZH', name: '中文' },
  ];

  return (
    <div className="relative z-50" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5 px-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline-block">{lang}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 origin-top-right border border-border bg-background p-1 shadow-2xl shadow-black/50 animate-fade-in">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as Language);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs uppercase tracking-wider transition-colors ${
                lang === l.code
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
              }`}
            >
              <span>{l.name}</span>
              {lang === l.code && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
