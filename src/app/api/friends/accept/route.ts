import pusherEvents from '@/helpers/pusherEvents';
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
    const { id: friendId } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;

    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${currentUserId}:friends`,
      friendId
    );

    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${currentUserId}:${pusherEvents.INCOMING_FRIEND_REQUEST}`,
      friendId
    );

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 });
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${currentUserId}`),
      fetchRedis('get', `user:${friendId}`),
    ])) as [string, string];

    const [user, friend] = [JSON.parse(userRaw), JSON.parse(friendRaw)];

    //! doing all this actions simultaneously, because they are all independent
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${friendId}:friends`),
        pusherEvents.NEW_FRIEND,
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${currentUserId}:friends`),
        pusherEvents.NEW_FRIEND,
        friend
      ),
      //! accept friend request
      await db.sadd(`user:${currentUserId}:friends`, friendId),
      await db.sadd(`user:${friendId}:friends`, currentUserId),
      //! remove friend request from db
      await db.srem(
        `user:${currentUserId}:${pusherEvents.INCOMING_FRIEND_REQUEST}`,
        friendId
      ),
    ]);

    // TODO: await db.srem(`user:${currentUserId}:outbound_friend_requests`, friendId);

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response('Could not accept friend request', { status: 500 });
  }
}
