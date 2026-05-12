'use client';

import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated: May 8, 2026',
    inquiries: 'Privacy inquiries:',
    sections: [
      {
        title: '1. Data We Collect',
        body: 'Prova collects the minimum data necessary to provide our service: Solana wallet addresses (public keys only), on-chain attestation data (public by design), and usage metrics for billing.',
      },
      {
        title: '2. On-Chain Data',
        body: 'Data submitted to the Solana blockchain is public and immutable. Do not submit personally identifiable information in attestation payloads. Use Privacy Mode (Vanish Core) for sensitive data.',
      },
      {
        title: '3. LFPDPPP Compliance (Mexico)',
        body: 'Prova complies with the Ley Federal de Protección de Datos Personales en Posesión de los Particulares. For ARCO requests (Access, Rectification, Cancellation, Opposition), contact: privacy@prova.io.',
      },
      {
        title: '4. Contact',
        body: null,
        email: 'privacy@prova.io',
      },
    ],
  },
  ES: {
    tag: 'Legal',
    title: 'Política de Privacidad',
    updated: 'Última actualización: 8 de mayo de 2026',
    inquiries: 'Consultas de privacidad:',
    sections: [
      {
        title: '1. Datos que recopilamos',
        body: 'Prova recopila los datos mínimos necesarios para brindar nuestro servicio: direcciones de wallets de Solana (solo claves públicas), datos de atestación on-chain (públicos por diseño), y métricas de uso para facturación.',
      },
      {
        title: '2. Datos On-Chain',
        body: 'Los datos enviados a la blockchain de Solana son públicos e inmutables. No envíes información personal identificable en los payloads de atestación. Usa el Modo de Privacidad (Vanish Core) para datos sensibles.',
      },
      {
        title: '3. Cumplimiento LFPDPPP (México)',
        body: 'Prova cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Para solicitudes ARCO (Acceso, Rectificación, Cancelación, Oposición), contacta: privacy@prova.io.',
      },
      {
        title: '4. Contacto',
        body: null,
        email: 'privacy@prova.io',
      },
    ],
  },
  ZH: {
    tag: '法律',
    title: '隐私政策',
    updated: '最后更新：2026 年 5 月 8 日',
    inquiries: '隐私咨询：',
    sections: [
      {
        title: '1. 我们收集的数据',
        body: 'Prova 仅收集提供服务所需的最少数据：Solana 钱包地址（仅公钥）、链上证明数据（设计上公开）以及用于计费的使用指标。',
      },
      {
        title: '2. 链上数据',
        body: '提交到 Solana 区块链的数据是公开且不可篡改的。请勿在证明负载中提交个人身份信息。对于敏感数据，请使用隐私模式（Vanish Core）。',
      },
      {
        title: '3. LFPDPPP 合规（墨西哥）',
        body: 'Prova 遵守《联邦个人数据保护法》。如需 ARCO 请求（访问、更正、取消、反对），请联系：privacy@prova.io。',
      },
      {
        title: '4. 联系方式',
        body: null,
        email: 'privacy@prova.io',
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-3 font-mono text-xs text-muted-foreground">{t.updated}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden />
          <div className="space-y-8">
            {t.sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-lg uppercase text-foreground">{s.title}</h2>
                {s.body && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                )}
                {s.email && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t.inquiries}{' '}
                    <a href={`mailto:${s.email}`} className="font-mono text-primary hover:text-foreground">
                      {s.email}
                    </a>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
