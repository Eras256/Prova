// Modelo de contenido de la documentación. Cada página es una lista de
// bloques tipados que el DocRenderer pinta con el sistema mono-brutalist.

export type DocBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; title?: string; code: string }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'callout'; tone: 'info' | 'warn'; text: string };

export interface DocContent {
  /** Título H1 de la página. */
  title: string;
  /** Párrafo introductorio bajo el título. */
  intro: string;
  blocks: DocBlock[];
}

export interface LocalizedDoc {
  EN: DocContent;
  ES: DocContent;
  ZH: DocContent;
}
