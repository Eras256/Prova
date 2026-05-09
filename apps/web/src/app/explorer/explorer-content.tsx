'use client';
import { SearchInput } from '@/components/explorer/search-input';
import { AttestationFeed } from '@/components/explorer/attestation-feed';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Forensic Explorer',
    headline: ['Look up any', 'agent action.', 'Verify it yourself.'],
    desc: 'Search by attestation ID, agent key, transaction signature, or schema. Every result is verified on-chain in your browser — we never sit between you and the signature.',
  },
  ES: {
    tag: 'Explorador Forense',
    headline: ['Busca cualquier', 'acción del agente.', 'Verifícalo tú mismo.'],
    desc: 'Busca por ID de atestación, clave de agente, firma de transacción o esquema. Cada resultado se verifica on-chain en tu navegador — nunca nos interponemos entre tú y la firma.',
  },
  ZH: {
    tag: '法证浏览器',
    headline: ['查找任何', '代理操作。', '亲自验证。'],
    desc: '通过证明 ID、代理密钥、交易签名或模式进行搜索。每个结果都会在你的浏览器中进行链上验证——我们绝不会介于你和签名之间。',
  }
};

export function ExplorerContent() {
  const { lang } = useI18n();
  const t = content[lang];
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="mt-2 block text-muted-foreground">{t.headline[2]}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <SearchInput />
          <AttestationFeed />
        </div>
      </div>
    </div>
  );
}
