'use client';

import AuthForm from '@/components/ui/AuthForm';
import FormControl from '@/components/ui/FormControl';
import {
  RegisterSchema,
  registerValidator,
} from '@/lib/validations/register-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function RegisterPage() {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerValidator),
  });

  useEffect(() => {
    console.log(Object.entries(errors));
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setShowSuccessState(true);
      const validatedData = registerValidator.parse(data);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const responseData = await axios.post(
        '/api/auth/register',
        validatedData
      );
      // console.dir(responseData.data);
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
        title="Sign up"
        submitLabel="Sign up"
        link="/login"
        linkLabel="Already have an account?"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl
          label="Name"
          placeholder="Type your name"
          type="text"
          id="name"
          Icon={User}
          registerProps={register('name')}
        />
        <FormControl
          label="Email"
          placeholder="Type your email"
          type="email"
          id="email"
          Icon={Mail}
          registerProps={register('email')}
        />
        <FormControl
          label="Password"
          placeholder="Type your password"
          type="password"
          id="password"
          Icon={Lock}
          registerProps={register('password')}
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
