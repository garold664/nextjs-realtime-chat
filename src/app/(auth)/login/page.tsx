'use client';

import Button from '@/components/ui/Button';
import GoogleLogo from '@/components/ui/GoogleLogo';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  async function loginWithGoogle() {
    setIsLoading(true);
    try {
      // throw new Error('Not implemented');
      await signIn('google');
    } catch (error) {
      toast.error('Could not sign in');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col items-center max-w-md space-y-8">
        <div className="flex flex-col items-center gap-8">
          logo
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <Button
          isLoading={isLoading}
          type="button"
          className="max-w-sm mx-auto w-full"
          onClick={loginWithGoogle}
        >
          {!isLoading && <GoogleLogo />}
          Google
        </Button>
      </div>
    </div>
  );
};

export default page;
