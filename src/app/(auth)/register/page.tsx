'use client';

import AuthForm from '@/components/ui/AuthForm';
import FormControl from '@/components/ui/FormControl';
import { Lock, Mail, User } from 'lucide-react';

export default function RegisterPage() {
  return (
    <>
      <AuthForm
        title="Sign up"
        submitLabel="Sign up"
        link="/login"
        linkLabel="Already have an account?"
      >
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
      </AuthForm>
    </>
  );
}
