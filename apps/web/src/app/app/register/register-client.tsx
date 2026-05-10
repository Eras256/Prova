'use client';

import dynamic from 'next/dynamic';

const RegisterAgent = dynamic(
  () => import('@/components/app/register-agent').then((m) => m.RegisterAgent),
  { ssr: false }
);

export function RegisterClient() {
  return <RegisterAgent />;
}
