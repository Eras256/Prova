import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with the Prova team.' };

export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-white">Contact</h1>
        <p className="mt-4 text-muted-foreground">Have a question, partnership idea, or enterprise inquiry? We&apos;d love to hear from you.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            { label: 'General', email: 'hello@prova.io' },
            { label: 'Security', email: 'security@prova.io' },
            { label: 'Enterprise Sales', email: 'sales@prova.io' },
            { label: 'Press', email: 'press@prova.io' },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-medium text-white">{c.label}</p>
              <a href={`mailto:${c.email}`} className="mt-1 text-sm text-primary hover:underline">{c.email}</a>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-6">
          <h3 className="font-semibold text-white">Community</h3>
          <div className="mt-3 flex gap-4 text-sm">
            <a href="https://discord.gg/prova" className="text-muted-foreground hover:text-white">Discord</a>
            <a href="https://x.com/prova_io" className="text-muted-foreground hover:text-white">X (Twitter)</a>
            <a href="https://github.com/Eras256/Prova" className="text-muted-foreground hover:text-white">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}
