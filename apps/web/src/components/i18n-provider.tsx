'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'EN' | 'ES' | 'ZH';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  EN: {
    home: 'Home',
    product: 'Product',
    explorer: 'Explorer',
    developers: 'Developers',
    solutions: 'Solutions',
    pricing: 'Pricing',
    docs: 'Docs',
    registerAgent: 'Register agent',
    startBuilding: 'Start building',
    live: 'LIVE',
    shippedThisWeek: 'v0.1.5 on npm →',
    heroTitle1: 'A verifiable',
    heroTitle2: 'record of every',
    heroTitle3: 'action your',
    heroTitle4: 'AI agent',
    heroTitle5: 'takes.',
    heroDesc1: 'Prova writes a signed, on-chain receipt for every transaction, decision, and tool call your agent makes —',
    heroDesc2: ' sub-second, sub-cent, verifiable by anyone, forever.',
    shipFirst: 'Ship your first attestation',
    seeFeed: 'See the live feed',
    finality: 'finality',
    perReceipt: 'per receipt',
    openSource: 'open source',
    native: 'native',
    feedFooter: 'Real schema · Mock data on devnet · Verify any of it →',
    liveAttestations: 'Live attestations',
    thisSession: 'this session',
    total: 'total',
    liveOnDevnet: 'live on devnet',
    demoAwaiting: 'demo · awaiting devnet activity',
    openExplorer: 'Open Explorer →',
    sAgo: 's ago',
    mAgo: 'm ago',
    hAgo: 'h ago',
    productPageTitle: 'Product',
    productHeadline1: 'How a single',
    productHeadline2: 'agent action',
    productHeadline3: 'becomes forensic-',
    productHeadline4: 'grade evidence.',
    productDesc: 'Four short tours through the parts of Prova that matter most. Engineers, security teams, and compliance reviewers all get a way in.',
    tagCore: 'Core',
    tagDevelopers: 'Developers',
    tagTrust: 'Trust',
    tagCompliance: 'Compliance',
    titleHowItWorks: 'How it works',
    titleSdk: 'SDK',
    titleSecurity: 'Security',
    titlePrivacyMode: 'Privacy mode',
    descHowItWorks: 'Architecture, sequence diagrams, and a walkthrough from agent action to on-chain receipt.',
    descSdk: 'TypeScript and Rust SDK reference. Same surface, same guarantees, both Apache 2.0.',
    descSecurity: 'STRIDE threat model, key custody, audit reports, and bug bounty.',
    descPrivacyMode: 'Selective disclosure with Vanish Core — prove an action happened without leaking what it was.'
  },
  ES: {
    home: 'Inicio',
    product: 'Producto',
    explorer: 'Explorador',
    developers: 'Desarrolladores',
    solutions: 'Soluciones',
    pricing: 'Precios',
    docs: 'Documentación',
    registerAgent: 'Registrar agente',
    startBuilding: 'Empezar',
    live: 'EN VIVO',
    shippedThisWeek: 'v0.1.5 en npm →',
    heroTitle1: 'Un registro',
    heroTitle2: 'verificable de',
    heroTitle3: 'cada acción que',
    heroTitle4: 'tu agente de IA',
    heroTitle5: 'realiza.',
    heroDesc1: 'Prova escribe un recibo firmado on-chain de cada transacción, decisión y llamada de herramienta que hace tu agente —',
    heroDesc2: ' en subsegundos, por menos de un centavo, verificable por cualquiera, para siempre.',
    shipFirst: 'Envía tu primera atestación',
    seeFeed: 'Ver el feed en vivo',
    finality: 'finalidad',
    perReceipt: 'por recibo',
    openSource: 'código abierto',
    native: 'nativo',
    feedFooter: 'Esquema real · Datos de prueba en devnet · Verifícalo →',
    liveAttestations: 'Atestaciones en vivo',
    thisSession: 'esta sesión',
    total: 'total',
    liveOnDevnet: 'en vivo en devnet',
    demoAwaiting: 'demo · esperando actividad en devnet',
    openExplorer: 'Abrir Explorador →',
    sAgo: 's atrás',
    mAgo: 'm atrás',
    hAgo: 'h atrás',
    productPageTitle: 'Producto',
    productHeadline1: 'Cómo una sola',
    productHeadline2: 'acción de agente',
    productHeadline3: 'se convierte en',
    productHeadline4: 'evidencia forense.',
    productDesc: 'Cuatro breves recorridos por las partes más importantes de Prova. Ingenieros, equipos de seguridad y revisores de cumplimiento tienen su lugar.',
    tagCore: 'Núcleo',
    tagDevelopers: 'Desarrolladores',
    tagTrust: 'Confianza',
    tagCompliance: 'Cumplimiento',
    titleHowItWorks: 'Cómo funciona',
    titleSdk: 'SDK',
    titleSecurity: 'Seguridad',
    titlePrivacyMode: 'Modo Privacidad',
    descHowItWorks: 'Arquitectura, diagramas de secuencia y un recorrido desde la acción del agente hasta el recibo on-chain.',
    descSdk: 'Referencia del SDK de TypeScript y Rust. Misma superficie, mismas garantías, ambos Apache 2.0.',
    descSecurity: 'Modelo de amenazas STRIDE, custodia de claves, reportes de auditoría y bug bounty.',
    descPrivacyMode: 'Divulgación selectiva con Vanish Core — prueba que una acción ocurrió sin revelar cuál fue.'
  },
  ZH: {
    home: '首页',
    product: '产品',
    explorer: '浏览器',
    developers: '开发者',
    solutions: '解决方案',
    pricing: '定价',
    docs: '文档',
    registerAgent: '注册代理',
    startBuilding: '开始构建',
    live: '实时',
    shippedThisWeek: 'v0.1.5 已发布到 npm →',
    heroTitle1: '一个可验证的',
    heroTitle2: '记录',
    heroTitle3: '关于你的',
    heroTitle4: 'AI代理的',
    heroTitle5: '每一步操作。',
    heroDesc1: 'Prova 为你的代理的每一笔交易、决定和工具调用写入一个签名的链上收据 —',
    heroDesc2: ' 亚秒级，低于一美分，任何人永远可验证。',
    shipFirst: '发布您的第一个证明',
    seeFeed: '查看实时动态',
    finality: '最终确认',
    perReceipt: '单据成本',
    openSource: '开源',
    native: '原生',
    feedFooter: '真实架构 · devnet 模拟数据 · 随时验证 →',
    liveAttestations: '实时证明',
    thisSession: '本会话',
    total: '总计',
    liveOnDevnet: 'devnet 实时运行中',
    demoAwaiting: '演示 · 等待 devnet 活动',
    openExplorer: '打开浏览器 →',
    sAgo: '秒前',
    mAgo: '分钟前',
    hAgo: '小时前',
    productPageTitle: '产品',
    productHeadline1: '单个代理操作',
    productHeadline2: '是如何',
    productHeadline3: '变成法证级',
    productHeadline4: '证据的。',
    productDesc: '四次简短的导览，带您了解 Prova 最核心的部分。工程师、安全团队和合规审查员都能找到切入点。',
    tagCore: '核心',
    tagDevelopers: '开发者',
    tagTrust: '信任',
    tagCompliance: '合规',
    titleHowItWorks: '工作原理',
    titleSdk: 'SDK',
    titleSecurity: '安全性',
    titlePrivacyMode: '隐私模式',
    descHowItWorks: '架构、序列图以及从代理操作到链上收据的完整演示。',
    descSdk: 'TypeScript 和 Rust SDK 参考。相同的接口，相同的保证，均采用 Apache 2.0。',
    descSecurity: 'STRIDE 威胁模型、密钥托管、审计报告和漏洞赏金。',
    descPrivacyMode: '使用 Vanish Core 进行选择性披露 — 证明操作已发生而不泄露具体内容。'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['EN']] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
