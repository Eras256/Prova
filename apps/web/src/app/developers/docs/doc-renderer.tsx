'use client';
import { Fragment } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { DocBlock, DocContent } from './content/types';

// Renderiza `código inline` dentro de un texto plano (sin markdown completo).
function inline(text: string) {
  const parts = text.split('`');
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-primary/90"
      >
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case 'h2':
      return (
        <h2 className="mt-14 scroll-mt-24 border-t border-border pt-10 font-display text-xl uppercase leading-snug text-foreground first:mt-0 first:border-t-0 first:pt-0 lg:text-2xl">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="mt-8 font-display text-base uppercase text-foreground lg:text-lg">
          {block.text}
        </h3>
      );
    case 'p':
      return <p className="mt-4 leading-relaxed text-muted-foreground">{inline(block.text)}</p>;
    case 'list':
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="border-l-2 border-primary/30 pl-4 leading-relaxed text-muted-foreground"
            >
              {inline(item)}
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <div className="mt-5 border border-border bg-surface">
          {block.title && (
            <div className="border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {block.title}
            </div>
          )}
          <div className="overflow-x-auto p-4 sm:p-5">
            <pre className="font-mono text-[13px] leading-relaxed text-primary/90 sm:text-sm">
              {block.code}
            </pre>
          </div>
        </div>
      );
    case 'table':
      return (
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 align-top text-sm text-muted-foreground">
                      {inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout': {
      const warn = block.tone === 'warn';
      return (
        <div
          className={`mt-5 flex gap-3 border p-4 ${
            warn
              ? 'border-warning/40 bg-warning/5 text-warning'
              : 'border-primary/40 bg-primary/5 text-primary'
          }`}
        >
          {warn ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="text-sm leading-relaxed">{inline(block.text)}</p>
        </div>
      );
    }
  }
}

export function DocRenderer({ doc }: { doc: DocContent }) {
  return (
    <article className="min-w-0">
      <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
        {doc.title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
        {doc.intro}
      </p>
      <div className="mt-10">
        {doc.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </article>
  );
}
