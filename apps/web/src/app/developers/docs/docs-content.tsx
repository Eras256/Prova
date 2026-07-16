'use client';
import { useI18n } from '@/components/i18n-provider';
import { docsRegistry } from './content';
import { DocRenderer } from './doc-renderer';

// Componente cliente compartido por la página índice y las rutas [slug]:
// resuelve el idioma activo y renderiza el documento correspondiente.
export function DocsContent({ slug = '' }: { slug?: string }) {
  const { lang } = useI18n();
  const doc = docsRegistry[slug];
  if (!doc) return null;
  return <DocRenderer doc={doc[lang]} />;
}
