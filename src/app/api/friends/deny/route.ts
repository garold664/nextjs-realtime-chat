import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const currentUserId = session?.user.id;
    const { id: friendId } = z.object({ id: z.string() }).parse(body);

    const friend = JSON.parse(await fetchRedis('get', `user:${friendId}`));

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${currentUserId}:friends`),
        'deny-friend',
        friend
      ),
      db.srem(`user:${currentUserId}:incoming_friend_requests`, friendId),
    ]);

    return new Response('OK', { status: 200 });
  } catch (error) {}
}
