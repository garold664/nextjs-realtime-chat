import { z } from 'zod';

export const registerValidator = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(20, { message: 'Name must be less than 20 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(20, {
      message: 'Password must be less than 20 characters',
    }),
});

export type registerSchema = z.infer<typeof registerValidator>;
