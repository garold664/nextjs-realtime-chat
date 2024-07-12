'use client';

import { Icons } from '@/components/Icons';
import AuthForm from '@/components/ui/AuthForm';
import Button from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import GoogleLogo from '@/components/ui/GoogleLogo';
import { Lock, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  return (
    <>
      <AuthForm
        title="Sign in"
        submitLabel="Login"
        link="/register"
        linkLabel="Don't have an account?"
      >
        <FormControl
          label="Email"
          placeholder="Type your email"
          type="email"
          name="email"
          id="email"
          Icon={User}
        />
        <FormControl
          label="Password"
          placeholder="Type your password"
          type="password"
          name="password"
          id="password"
          Icon={Lock}
        />
      </AuthForm>
    </>
  );
}
