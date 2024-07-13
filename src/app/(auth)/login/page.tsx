'use client';

import AuthForm from '@/components/ui/AuthForm';
import FormControl from '@/components/ui/FormControl';
import { LoginSchema, loginValidator } from '@/lib/validations/login-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
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
      // const responseData = await axios.post('/api/auth/login', validatedData);
      // console.dir(responseData.data);
      setShowSuccessState(true);
    } catch (error) {
      setShowSuccessState(false);
      if (error instanceof z.ZodError) {
        setError('root', { message: error.message });
        // console.log(errors);
        return;
      }

      if (error instanceof AxiosError) {
        setError('root', { message: error.response?.data });
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
