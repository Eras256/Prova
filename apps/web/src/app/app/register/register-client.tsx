'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const RegisterAgent = dynamic(
  () => import('@/components/app/register-agent').then((m) => m.RegisterAgent),
  { ssr: false }
);

class RegisterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg border border-destructive/40 bg-destructive/5 p-8">
            <h2 className="font-display text-xl uppercase text-foreground">Registration Error</h2>
            <p className="mt-4 font-mono text-sm text-destructive break-words">
              {this.state.error.message}
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
