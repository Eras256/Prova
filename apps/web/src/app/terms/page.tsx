'use client';

import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated: May 8, 2026',
    inquiries: 'Legal inquiries:',
    sections: [
      {
        title: '1. Acceptance',
        body: 'By using Prova, you agree to these terms. If you do not agree, do not use the service.',
      },
      {
        title: '2. No Financial Advice',
        body: 'Prova is a software tool for cryptographic attestation. Nothing on this platform constitutes financial, legal, or investment advice.',
      },
      {
        title: '3. Non-Custodial',
        body: 'Prova never takes custody of user funds or private keys. You are solely responsible for the security of your keypairs.',
      },
      {
        title: '4. Disclaimer',
        body: 'Prova is NOT affiliated with, endorsed by, or sponsored by the Solana Foundation. Solana® is a registered trademark of the Solana Foundation.',
      },
      {
        title: '5. Contact',
        body: null,
        email: 'xvaiosx7@gmail.com',
      },
    ],
  },
  ES: {
    tag: 'Legal',
    title: 'Términos de Servicio',
    updated: 'Última actualización: 8 de mayo de 2026',
    inquiries: 'Consultas legales:',
    sections: [
      {
        title: '1. Aceptación',
        body: 'Al usar Prova, aceptas estos términos. Si no estás de acuerdo, no utilices el servicio.',
      },
      {
        title: '2. Sin Asesoramiento Financiero',
        body: 'Prova es una herramienta de software para atestación criptográfica. Nada en esta plataforma constituye asesoramiento financiero, legal o de inversión.',
      },
      {
        title: '3. Sin Custodia',
        body: 'Prova nunca toma custodia de fondos de usuarios ni claves privadas. Eres el único responsable de la seguridad de tus keypairs.',
      },
      {
        title: '4. Aviso Legal',
        body: 'Prova NO está afiliado, respaldado ni patrocinado por la Solana Foundation. Solana® es una marca registrada de la Solana Foundation.',
      },
      {
        title: '5. Contacto',
        body: null,
        email: 'xvaiosx7@gmail.com',
      },
    ],
  },
  ZH: {
    tag: '法律',
    title: '服务条款',
    updated: '最后更新：2026 年 5 月 8 日',
    inquiries: '法律咨询：',
    sections: [
      {
        title: '1. 接受条款',
        body: '使用 Prova 即表示您同意这些条款。如果您不同意，请勿使用本服务。',
      },
      {
        title: '2. 非财务建议',
        body: 'Prova 是一款用于加密证明的软件工具。本平台上的任何内容均不构成财务、法律或投资建议。',
      },
      {
        title: '3. 非托管',
        body: 'Prova 从不托管用户资金或私钥。您对密钥对的安全性承担全部责任。',
      },
      {
        title: '4. 免责声明',
        body: 'Prova 与 Solana Foundation 没有任何关联、背书或赞助关系。Solana® 是 Solana Foundation 的注册商标。',
      },
      {
        title: '5. 联系方式',
        body: null,
        email: 'xvaiosx7@gmail.com',
      },
    ],
  },
};

export default function TermsPage() {
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
