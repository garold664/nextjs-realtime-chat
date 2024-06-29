import { authOptions } from '@/lib/auth';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: emailToAdd } = addFriendValidator.parse(body);
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    const data = (await RESTResponse.json()) as { result: string | null };

    const idToAdd = data.result;

    if (!idToAdd) {
      return new Response("This person doesn't exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself', { status: 400 });
    }
  } catch (error) {}
}
