'use client';

import { ProviderProps } from 'react';
import { Toaster } from 'react-hot-toast';

type ProvidersProps = { children: React.ReactNode };

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
}
