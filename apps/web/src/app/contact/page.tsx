'use client';

import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Contact',
    headline: ['Get in touch.'],
    desc: "Have a question, partnership idea, or enterprise inquiry? We'd love to hear from you.",
    channels: [
      { label: 'General',           email: 'xvaiosx7@gmail.com' },
      { label: 'Security',          email: 'xvaiosx7@gmail.com' },
      { label: 'Enterprise Sales',  email: 'xvaiosx7@gmail.com' },
      { label: 'Press',             email: 'xvaiosx7@gmail.com' },
    ],
    communityLabel: 'Community',
  },
  ES: {
    tag: 'Contacto',
    headline: ['Escríbenos.'],
    desc: '¿Tienes una pregunta, idea de asociación o consulta empresarial? Nos encantaría escucharte.',
    channels: [
      { label: 'General',             email: 'xvaiosx7@gmail.com' },
      { label: 'Seguridad',           email: 'xvaiosx7@gmail.com' },
      { label: 'Ventas Enterprise',   email: 'xvaiosx7@gmail.com' },
      { label: 'Prensa',              email: 'xvaiosx7@gmail.com' },
    ],
    communityLabel: 'Comunidad',
  },
  ZH: {
    tag: '联系我们',
    headline: ['联系我们。'],
    desc: '有问题、合作想法或企业咨询？我们很乐意倾听。',
    channels: [
      { label: '通用',      email: 'xvaiosx7@gmail.com' },
      { label: '安全',      email: 'xvaiosx7@gmail.com' },
      { label: '企业销售',  email: 'xvaiosx7@gmail.com' },
      { label: '媒体',      email: 'xvaiosx7@gmail.com' },
    ],
    communityLabel: '社区',
  },
};

export default function ContactPage() {
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
              {t.headline[0]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.desc}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden />
          <div className="space-y-6">
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {t.channels.map((c) => (
                <div key={c.label} className="bg-background px-5 py-5">
                  <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <a
                    href={`mailto:${c.email}`}
                    className="mt-1 block font-mono text-sm text-primary hover:text-foreground"
                  >
                    {c.email}
                  </a>
                </div>
              ))}
            </div>

            <div className="border border-border bg-surface p-5">
              <p className="font-pixel text-[12px] uppercase tracking-wider text-foreground">
                {t.communityLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a href="https://discord.gg/prova" className="font-mono text-muted-foreground hover:text-foreground">Discord</a>
                <a href="https://x.com/theprovaxyz" className="font-mono text-muted-foreground hover:text-foreground">X (Twitter)</a>
                <a href="https://github.com/Eras256/Prova" className="font-mono text-muted-foreground hover:text-foreground">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
