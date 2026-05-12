'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const RegisterAgent = dynamic(
  () => import('@/components/app/register-agent').then((m) => m.RegisterAgent),
  { ssr: false }
);

// Convierte cualquier valor lanzado (Error, string, null, objeto…) en un Error con mensaje.
function toError(raw: unknown): Error {
  if (raw instanceof Error) return raw;
  if (typeof raw === 'string' && raw) return new Error(raw);
  try {
    const msg = JSON.stringify(raw);
    return new Error(msg ?? 'Unknown error');
  } catch {
    return new Error('Unknown error');
  }
}

class RegisterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  // React puede llamar esto con cualquier valor lanzado, no sólo Error instances.
  static getDerivedStateFromError(raw: unknown) {
    return { error: toError(raw) };
  }

  override render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg border border-destructive/40 bg-destructive/5 p-8">
            <h2 className="font-display text-xl uppercase text-foreground">Registration Error</h2>
            <p className="mt-4 font-mono text-sm text-destructive wrap-break-word">
              {error.message}
            </p>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="mt-6 bg-primary px-6 py-2 font-mono text-sm uppercase text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RegisterClient() {
  return (
    <RegisterErrorBoundary>
      <RegisterAgent />
    </RegisterErrorBoundary>
  );
}
