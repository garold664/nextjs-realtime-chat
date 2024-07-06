import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);
    const idToAdd = (await fetchRedis('get', `user:email:${emailToAdd}`)) as
      | string
      | null;

    // console.log('idToAdd: ', idToAdd);

    // const data = (await RESTResponse.json()) as { result: string | null };

    // const idToAdd = data.result;

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

    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response('Already added this user', { status: 400 });
    }

    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response('Already friends with this user', { status: 400 });
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 422 -the server was unable to process the request because it contains invalid data
      return new Response(`Invalid request payload: ${error.message}`, {
        status: 422,
      });
    }

    return new Response(`Invalid request`, { status: 400 });
  }
}
