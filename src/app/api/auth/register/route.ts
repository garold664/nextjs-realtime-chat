import { registerValidator } from '@/lib/validations/register-validator';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = registerValidator.parse(body);

    const responseData = {
      email: email,
      name: name,
      password: password,
    };
    return Response.json(responseData);
    // return new Response('something went wrong', { status: 500 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response('Unprocessable Entity', { status: 422 });
    }
    return new Response('Something went wrong', { status: 500 });
  }
}
