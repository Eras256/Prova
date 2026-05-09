'use client';
import { Badge, Button } from '@prova/ui';
import Link from 'next/link';
import { Book, Code, Terminal, Shield, ArrowRight, Layers, FileJson } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Documentation',
    title: 'Protocol Docs',
    desc: 'Everything you need to integrate Prova into your AI agents and build verifiable forensic trails.',
    sections: [
      {
        title: 'Core Concepts',
        items: [
          { icon: Layers, name: 'The Attestation Lifecycle', href: '#' },
          { icon: Shield, name: 'Ed25519 Signatures & Security', href: '#' },
          { icon: Code, name: 'Anchor Program Architecture', href: '#' },
        ]
      },
      {
        title: 'Integration',
        items: [
          { icon: Terminal, name: 'TypeScript SDK Reference', href: '/developers/sdks' },
          { icon: Terminal, name: 'Rust SDK Reference', href: '/developers/sdks' },
          { icon: FileJson, name: 'REST API Endpoints', href: '/developers/api' },
        ]
      },
      {
        title: 'Guides',
        items: [
          { icon: Book, name: 'Verifying receipts on-chain', href: '#' },
          { icon: Book, name: 'Building a custom explorer', href: '#' },
          { icon: Shield, name: 'Metacomp KYA Compliance', href: '#' },
        ]
      }
    ],
    quickStartTitle: 'Ready to write some code?',
    quickStartDesc: 'Issue your first AI agent behavior attestation on Solana in under 2 minutes.',
    quickStartCta: 'Open Quick Start'
  },
  ES: {
    tag: 'Documentación',
    title: 'Docs del Protocolo',
    desc: 'Todo lo que necesitas para integrar Prova en tus agentes de IA y construir rastros forenses verificables.',
    sections: [
      {
        title: 'Conceptos Principales',
        items: [
          { icon: Layers, name: 'El Ciclo de Vida de Atestación', href: '#' },
          { icon: Shield, name: 'Firmas Ed25519 y Seguridad', href: '#' },
          { icon: Code, name: 'Arquitectura del Programa Anchor', href: '#' },
        ]
      },
      {
        title: 'Integración',
        items: [
          { icon: Terminal, name: 'Referencia del SDK de TypeScript', href: '/developers/sdks' },
          { icon: Terminal, name: 'Referencia del SDK de Rust', href: '/developers/sdks' },
          { icon: FileJson, name: 'Endpoints de la API REST', href: '/developers/api' },
        ]
      },
      {
        title: 'Guías',
        items: [
          { icon: Book, name: 'Verificando recibos on-chain', href: '#' },
          { icon: Book, name: 'Construyendo un explorador personalizado', href: '#' },
          { icon: Shield, name: 'Cumplimiento KYA de Metacomp', href: '#' },
        ]
      }
    ],
    quickStartTitle: '¿Listo para escribir código?',
    quickStartDesc: 'Emite la primera atestación de comportamiento de tu agente de IA en Solana en menos de 2 minutos.',
    quickStartCta: 'Abrir Inicio Rápido'
  },
  ZH: {
    tag: '文档',
    title: '协议文档',
    desc: '将 Prova 集成到您的 AI 代理并构建可验证的法证追踪所需的一切。',
    sections: [
      {
        title: '核心概念',
        items: [
          { icon: Layers, name: '证明生命周期', href: '#' },
          { icon: Shield, name: 'Ed25519 签名与安全', href: '#' },
          { icon: Code, name: 'Anchor 程序架构', href: '#' },
        ]
      },
      {
        title: '集成',
        items: [
          { icon: Terminal, name: 'TypeScript SDK 参考', href: '/developers/sdks' },
          { icon: Terminal, name: 'Rust SDK 参考', href: '/developers/sdks' },
          { icon: FileJson, name: 'REST API 接口', href: '/developers/api' },
        ]
      },
      {
        title: '指南',
        items: [
          { icon: Book, name: '在链上验证收据', href: '#' },
          { icon: Book, name: '构建自定义浏览器', href: '#' },
          { icon: Shield, name: 'Metacomp KYA 合规', href: '#' },
        ]
      }
    ],
    quickStartTitle: '准备好写代码了吗？',
    quickStartDesc: '在不到 2 分钟的时间内，在 Solana 上发出您的首个 AI 代理行为证明。',
    quickStartCta: '打开快速入门'
  }
};

export function DocsContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Badge variant="secondary" className="mb-4">{t.tag}</Badge>
        <h1 className="text-4xl font-bold text-white">{t.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {t.desc}
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {t.sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-6 font-display text-xl uppercase text-white">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 -ml-3 transition-colors hover:border-border hover:bg-surface"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-white">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-xl border border-border bg-primary/5 p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h3 className="font-display text-xl uppercase text-white">{t.quickStartTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.quickStartDesc}
            </p>
          </div>
          <Button asChild>
            <Link href="/developers/quick-start" className="gap-2">
              {t.quickStartCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
