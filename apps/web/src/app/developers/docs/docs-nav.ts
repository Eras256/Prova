// Estructura de navegación de la documentación. Fuente única para el sidebar,
// el prev/next y generateStaticParams del route dinámico.

export type DocsLang = 'EN' | 'ES' | 'ZH';

export interface DocsNavItem {
  /** Slug de la ruta. '' es la página índice (/developers/docs). */
  slug: string;
  titles: Record<DocsLang, string>;
}

export interface DocsNavGroup {
  labels: Record<DocsLang, string>;
  items: DocsNavItem[];
}

export const DOCS_BASE = '/developers/docs';

export const docsNav: DocsNavGroup[] = [
  {
    labels: { EN: 'Start', ES: 'Empieza', ZH: '开始' },
    items: [
      { slug: '', titles: { EN: 'Overview', ES: 'Visión general', ZH: '概览' } },
      {
        slug: 'getting-started',
        titles: { EN: 'Getting Started', ES: 'Primeros pasos', ZH: '快速上手' },
      },
    ],
  },
  {
    labels: { EN: 'Concepts', ES: 'Conceptos', ZH: '概念' },
    items: [
      {
        slug: 'core-concepts',
        titles: { EN: 'Core Concepts', ES: 'Conceptos clave', ZH: '核心概念' },
      },
    ],
  },
  {
    labels: { EN: 'SDKs', ES: 'SDKs', ZH: 'SDK' },
    items: [
      { slug: 'sdk-typescript', titles: { EN: 'TypeScript SDK', ES: 'SDK TypeScript', ZH: 'TypeScript SDK' } },
      { slug: 'agent-kit', titles: { EN: 'Agent Kit Adapter', ES: 'Adapter Agent Kit', ZH: 'Agent Kit 适配器' } },
      { slug: 'plugin-eliza', titles: { EN: 'elizaOS Plugin', ES: 'Plugin elizaOS', ZH: 'elizaOS 插件' } },
      { slug: 'sdk-rust', titles: { EN: 'Rust SDK', ES: 'SDK Rust', ZH: 'Rust SDK' } },
      { slug: 'mcp-server', titles: { EN: 'MCP Server', ES: 'Servidor MCP', ZH: 'MCP 服务器' } },
    ],
  },
  {
    labels: { EN: 'Reference', ES: 'Referencia', ZH: '参考' },
    items: [
      { slug: 'api-reference', titles: { EN: 'REST API', ES: 'API REST', ZH: 'REST API' } },
      { slug: 'program', titles: { EN: 'On-chain Program', ES: 'Programa on-chain', ZH: '链上程序' } },
    ],
  },
];

/** Lista plana en orden de lectura (para prev/next y static params). */
export const docsFlat: DocsNavItem[] = docsNav.flatMap((g) => g.items);

export function docHref(slug: string): string {
  return slug === '' ? DOCS_BASE : `${DOCS_BASE}/${slug}`;
}
