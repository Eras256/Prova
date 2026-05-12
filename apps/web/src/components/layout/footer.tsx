'use client';
import Link from 'next/link';
import { Separator } from '@prova/ui';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    description: 'The forensic settlement layer for the Agentic Internet. Cryptographic behavior attestations via the Solana Machine Payment Protocol.',
    sections: {
      Product: [
        { label: 'How it works', href: '/product/how' },
        { label: 'SDK', href: '/product/sdk' },
        { label: 'Security', href: '/product/security' },
        { label: 'Privacy mode', href: '/product/privacy' },
      ],
      Developers: [
        { label: 'Quick start', href: '/developers/quick-start' },
        { label: 'Documentation', href: '/developers/docs' },
        { label: 'API & MCP reference', href: '/developers/api' },
        { label: 'Examples', href: '/developers/examples' },
      ],
      Solutions: [
        { label: 'For compliance', href: '/solutions/compliance' },
        { label: 'For operators', href: '/solutions/operators' },
        { label: 'For legal', href: '/solutions/legal' },
        { label: 'For auditors', href: '/solutions/auditors' },
      ],
      Company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    copyright: '© 2026 Prova Labs · Apache 2.0 · Built in the open',
    links: {
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact'
    },
    disclaimer: 'Independent project. Not affiliated with the Solana Foundation. Solana® is a registered trademark.',
    compliance: 'Compliant with Solana.org Developer Guidelines & Solana Foundation Code of Conduct (May 2026).'
  },
  ES: {
    description: 'La capa de liquidación forense para el Internet de Agentes. Atestaciones de comportamiento criptográficas vía el Machine Payment Protocol de Solana.',
    sections: {
      Producto: [
        { label: 'Cómo funciona', href: '/product/how' },
        { label: 'SDK', href: '/product/sdk' },
        { label: 'Seguridad', href: '/product/security' },
        { label: 'Modo privado', href: '/product/privacy' },
      ],
      Desarrolladores: [
        { label: 'Inicio rápido', href: '/developers/quick-start' },
        { label: 'Documentación', href: '/developers/docs' },
        { label: 'Referencia API y MCP', href: '/developers/api' },
        { label: 'Ejemplos', href: '/developers/examples' },
      ],
      Soluciones: [
        { label: 'Para cumplimiento', href: '/solutions/compliance' },
        { label: 'Para operadores', href: '/solutions/operators' },
        { label: 'Para legal', href: '/solutions/legal' },
        { label: 'Para auditores', href: '/solutions/auditors' },
      ],
      Empresa: [
        { label: 'Acerca de', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Empleo', href: '/careers' },
        { label: 'Contacto', href: '/contact' },
      ],
    },
    copyright: '© 2026 Prova Labs · Apache 2.0 · Código abierto',
    links: {
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto'
    },
    disclaimer: 'Proyecto independiente. No afiliado a la Solana Foundation. Solana® es una marca registrada.',
    compliance: 'Cumple con las Directrices de Solana.org y el Código de Conducta de la Solana Foundation (Mayo 2026).'
  },
  ZH: {
    description: '代理互联网的法证级结算层。通过 Solana 机器支付协议提供密码学行为证明。',
    sections: {
      产品: [
        { label: '工作原理', href: '/product/how' },
        { label: 'SDK', href: '/product/sdk' },
        { label: '安全性', href: '/product/security' },
        { label: '隐私模式', href: '/product/privacy' },
      ],
      开发者: [
        { label: '快速入门', href: '/developers/quick-start' },
        { label: '文档', href: '/developers/docs' },
        { label: 'API 与 MCP 参考', href: '/developers/api' },
        { label: '示例', href: '/developers/examples' },
      ],
      解决方案: [
        { label: '合规性', href: '/solutions/compliance' },
        { label: '运营商', href: '/solutions/operators' },
        { label: '法务', href: '/solutions/legal' },
        { label: '审计', href: '/solutions/auditors' },
      ],
      公司: [
        { label: '关于', href: '/about' },
        { label: '博客', href: '/blog' },
        { label: '更新日志', href: '/changelog' },
        { label: '招聘', href: '/careers' },
        { label: '联系我们', href: '/contact' },
      ],
    },
    copyright: '© 2026 Prova Labs · Apache 2.0 · 开源构建',
    links: {
      privacy: '隐私政策',
      terms: '服务条款',
      contact: '联系我们'
    },
    disclaimer: '独立项目。不隶属于 Solana 基金会。Solana® 注册商标。',
    compliance: '符合 Solana.org 开发者指南与 Solana 基金会行为准则（2026年5月）。'
  }
};

export function Footer() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Prova — home" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center bg-primary font-display text-xs leading-none text-primary-foreground"
              >
                P
              </span>
              <span className="font-display text-sm uppercase tracking-tight text-foreground">PROVA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.description}
            </p>
            <div className="mt-5 flex gap-5">
              {[
                { label: 'X', href: 'https://x.com/prova_io' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(t.sections).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="mb-4 font-pixel text-[12px] uppercase tracking-wider text-foreground">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-mono uppercase tracking-wider">{t.copyright}</p>
            <p className="font-mono uppercase tracking-wider text-primary/80">{t.compliance}</p>
          </div>
          <div className="flex gap-5 font-mono uppercase tracking-wider">
            <Link href="/privacy" className="transition-colors hover:text-foreground">{t.links.privacy}</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">{t.links.terms}</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">{t.links.contact}</Link>
          </div>
          <p className="max-w-xs md:text-right">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
