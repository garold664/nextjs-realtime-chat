'use client';

import { addFriendValidator } from '@/lib/validations/add-friend';
import Button from './Button';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = z.infer<typeof addFriendValidator>;

export default function AddFriendButton() {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({
        email,
      });

      await axios.post('/api/friends/add', { email: validatedEmail });
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data });
        return;
      }

      setError('email', { message: 'Something went wrong' });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  // console.log(register('email'));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-secondary-900"
      >
        Add friend by E-mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          placeholder="you@example.com"
          className="block w-full rounded-md border-0 py-1.5 text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 placeholder:text-secondary-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
        <Button>Add</Button>
      </div>
      {showSuccessState && (
        <p className="text-green-600 text-sm mt-1">{'Friend request sent'}</p>
      )}
      {!showSuccessState && (
        <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
      )}
    </form>
  );
}
