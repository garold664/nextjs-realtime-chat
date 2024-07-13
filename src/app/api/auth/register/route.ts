import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { registerValidator } from '@/lib/validations/register-validator';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = registerValidator.parse(body);

    const existingUser = await db.get(`user:email:${email}`);

    if (existingUser) {
      return new Response('User already exists', { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = nanoid();

    const userData = {
      email: email,
      name: name,
      password: hashedPassword,
      id: userId,
      image: '',
    };

    await db.set(`user:${userId}`, userData);
    await db.set(`user:email:${email}`, userId);
    // return Response.json(userData);
    // return new Response('something went wrong', { status: 500 });
    return new Response('Ok', { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response('Unprocessable Entity', { status: 422 });
    }
    return new Response('Something went wrong', { status: 500 });
  }
}
