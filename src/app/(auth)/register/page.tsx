'use client';

import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import GoogleLogo from '@/components/ui/GoogleLogo';
import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <Icons.Logo />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign up to your account
        </h2>
      </div>

      <form action="" className="flex flex-col gap-6 w-full">
        <FormControl
          label="Name"
          placeholder="Type your name"
          type="text"
          name="name"
          id="name"
          Icon={User}
        />
        <FormControl
          label="Email"
          placeholder="Type your email"
          type="email"
          name="email"
          id="email"
          Icon={Mail}
        />
        <FormControl
          label="Password"
          placeholder="Type your password"
          type="password"
          name="password"
          id="password"
          Icon={Lock}
        />
        <Button>Sign up</Button>
      </form>

      <p>Or Sign Up using</p>

      <Button
        isLoading={isLoading}
        type="button"
        className="max-w-sm mx-auto w-full"
        // onClick={loginWithGoogle}
      >
        {!isLoading && <GoogleLogo />}
        Google
      </Button>
      <Link
        href="/login"
        className="text-blue-900 hover:underline underline-offset-2"
      >
        Already have an account?
      </Link>
    </>
  );
}
