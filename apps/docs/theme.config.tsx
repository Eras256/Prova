import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <strong style={{ fontSize: '1.1rem' }}>Prova Docs</strong>,
  project: { link: 'https://github.com/prova-io/prova' },
  chat: { link: 'https://discord.gg/prova' },
  docsRepositoryBase: 'https://github.com/prova-io/prova/tree/main/apps/docs',
  footer: {
    content: 'Prova Documentation — Apache 2.0. Prova is NOT affiliated with the Solana Foundation.',
  },
};

export default config;
