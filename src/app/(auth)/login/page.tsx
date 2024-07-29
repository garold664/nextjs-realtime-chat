'use client';

import AuthForm from '@/components/ui/AuthForm';
import FormControl from '@/components/ui/FormControl';
import { LoginSchema, loginValidator } from '@/lib/validations/login-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginPage() {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginValidator),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const validatedData = loginValidator.parse(data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signIn('credentials', {
        ...validatedData,
        redirect: true,
        redirectTo: '/dashboard',
      });

      setShowSuccessState(true);
    } catch (error) {
      setShowSuccessState(false);
      if (error instanceof z.ZodError) {
        setError('root', { message: error.message });
        // console.log(errors);
        return;
      }
      setError('root', { message: 'Something went wrong' });
    }
  };
  return (
    <>
      <AuthForm
        title="Sign in"
        submitLabel="Login"
        link="/register"
        linkLabel="Don't have an account?"
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      >
        <FormControl
          label="Email"
          placeholder="Type your email"
          type="email"
          id="email"
          registerProps={register('email')}
          Icon={User}
        />
        <FormControl
          label="Password"
          placeholder="Type your password"
          type="password"
          id="password"
          registerProps={register('password')}
          Icon={Lock}
        />
        <div className="text-xs text-slate-500">
          test accounts: <br />
          1) you@example.com 1234567 <br />
          2) you2@example.com 1234567
        </div>
        {showSuccessState && (
          <p className="text-green-600 text-sm mt-1">{'Success! ✅'}</p>
        )}
        {!showSuccessState &&
          Object.entries(errors).map(([key, value]) => (
            <p key={key} className="text-red-600 text-sm mt-1">
              {value.message}
            </p>
          ))}
      </AuthForm>
    </>
  );
}
