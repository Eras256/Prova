'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, X } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { DOCS_BASE, docHref, docsFlat, docsNav } from './docs-nav';

const ui = {
  EN: { tag: 'Documentation', menu: 'Docs menu', prev: 'Previous', next: 'Next' },
  ES: { tag: 'Documentación', menu: 'Índice de docs', prev: 'Anterior', next: 'Siguiente' },
  ZH: { tag: '文档', menu: '文档目录', prev: '上一页', next: '下一页' },
};

function useActiveSlug(): string {
  const pathname = usePathname();
  if (!pathname || pathname === DOCS_BASE) return '';
  return pathname.replace(`${DOCS_BASE}/`, '').replace(/\/$/, '');
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { lang } = useI18n();
  const active = useActiveSlug();

  return (
    <nav aria-label="Docs" className="space-y-8">
      {docsNav.map((group) => (
        <div key={group.labels.EN}>
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">
            {group.labels[lang]}
          </p>
          <ul className="mt-3 space-y-1">
            {group.items.map((item) => {
              const isActive = active === item.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={docHref(item.slug)}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block border-l-2 py-1.5 pl-4 font-mono text-xs uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {item.titles[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PrevNext() {
  const { lang } = useI18n();
  const t = ui[lang];
  const active = useActiveSlug();
  const index = docsFlat.findIndex((d) => d.slug === active);
  if (index === -1) return null;
  const prev = index > 0 ? docsFlat[index - 1] : null;
  const next = index < docsFlat.length - 1 ? docsFlat[index + 1] : null;

  return (
    <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2">
      {prev ? (
        <Link
          href={docHref(prev.slug)}
          className="group flex flex-col gap-2 bg-background p-5 transition-colors hover:bg-surface"
        >
          <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> {t.prev}
          </span>
          <span className="font-mono text-sm uppercase tracking-wider text-foreground group-hover:text-primary">
            {prev.titles[lang]}
          </span>
        </Link>
      ) : (
        <div className="hidden bg-background sm:block" />
      )}
      {next ? (
        <Link
          href={docHref(next.slug)}
          className="group flex flex-col items-end gap-2 bg-background p-5 text-right transition-colors hover:bg-surface"
        >
          <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
            {t.next} <ArrowRight className="h-3 w-3" />
          </span>
          <span className="font-mono text-sm uppercase tracking-wider text-foreground group-hover:text-primary">
            {next.titles[lang]}
          </span>
        </Link>
      ) : (
        <div className="hidden bg-background sm:block" />
      )}
    </div>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  const t = ui[lang];
  const active = useActiveSlug();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cierra el drawer al navegar (incluye back/forward del navegador).
  useEffect(() => {
    setIsMenuOpen(false);
  }, [active]);

  const activeItem = docsFlat.find((d) => d.slug === active);

  return (
    <div className="min-h-screen">
      {/* Barra móvil/tablet: título de la página actual + toggle del índice */}
      <div className="sticky top-14 z-40 border-b border-border bg-background/95 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-expanded={isMenuOpen}
          aria-controls="docs-mobile-nav"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-6"
        >
          <span className="min-w-0">
            <span className="block font-pixel text-[11px] uppercase tracking-wider text-primary">
              {t.tag}
            </span>
            <span className="mt-0.5 block truncate font-mono text-sm uppercase tracking-wider text-foreground">
              {activeItem ? activeItem.titles[lang] : t.menu}
            </span>
          </span>
          {isMenuOpen ? (
            <X className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>
        {isMenuOpen && (
          <div
            id="docs-mobile-nav"
            className="max-h-[70vh] overflow-y-auto border-t border-border px-4 py-6 sm:px-6"
          >
            <SidebarNav onNavigate={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12 xl:grid-cols-[260px_1fr] xl:gap-16">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border py-12 pr-8">
              <p className="mb-8 font-pixel text-[13px] uppercase tracking-wider text-primary">
                {t.tag}
              </p>
              <SidebarNav />
            </div>
          </aside>

          {/* Contenido */}
          <main className="min-w-0 py-12 lg:py-16">
            {children}
            <PrevNext />
          </main>
        </div>
      </div>
    </div>
  );
}
