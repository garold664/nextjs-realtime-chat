import { Icons } from '../Icons';

import Link from 'next/link';
import GoogleLogo from './GoogleLogo';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FormEventHandler, useState } from 'react';
import Button from './Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerValidator } from '@/lib/validations/register-validator';

interface FormProps {
  children: React.ReactNode;
  title: string;
  submitLabel: string;
  linkLabel: string;
  link: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
}
export default function AuthForm({
  children,
  title,
  submitLabel,
  linkLabel,
  link,
  onSubmit,
  isSubmitting,
}: FormProps) {
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
    <>
      <div className="flex flex-col items-center gap-8">
        <Icons.Logo />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
        {children}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </form>

      <p>Or Sign In using</p>

      <Button
        isLoading={isLoading}
        type="button"
        className="max-w-sm mx-auto w-full"
        onClick={loginWithGoogle}
      >
        {!isLoading && <GoogleLogo />}
        Google
      </Button>
      <Link
        href={link}
        className="text-blue-900 hover:underline underline-offset-2"
      >
        {linkLabel}
      </Link>
    </>
  );
}
