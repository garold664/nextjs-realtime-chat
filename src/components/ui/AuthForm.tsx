import { Icons } from '../Icons';
import FormControl from './FormControl';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import GoogleLogo from './GoogleLogo';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Button from './Button';

interface FormProps {
  children: React.ReactNode;
  title: string;
  submitLabel: string;
  linkLabel: string;
  link: string;
}
export default function AuthForm({
  children,
  title,
  submitLabel,
  linkLabel,
  link,
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

      <form action="" className="flex flex-col gap-6 w-full">
        {children}
        <Button>{submitLabel}</Button>
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
