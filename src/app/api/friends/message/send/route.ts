import pusherEvents from '@/helpers/pusherEvents';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { messageValidator } from '@/lib/validations/message';
import { Message, User } from '@/types/db';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } =
      await request.json();

    // console.log('msgTest: ' + text);
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    const currentUserId = session.user.id;
    if (!currentUserId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const [userId1, userId2] = chatId.split('--');
    if (currentUserId !== userId1 && currentUserId !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = currentUserId === userId1 ? userId2 : userId1;
    const friendsList = await fetchRedis(
      'smembers',
      `user:${currentUserId}:friends`
    );

    const isFriend = friendsList.includes(friendId);

    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 });
    }

    const sender = JSON.parse(
      await fetchRedis('get', `user:${currentUserId}`)
    ) as User;
    // console.log('sender: ', sender);

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: currentUserId,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);
    //! LOG
    console.log('MESSAGE: ', message.text);

    const incomingMsgResponse = await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      pusherEvents.INCOMING_MESSAGE,
      message
    );

    console.log('incomingMsgResponse: ', incomingMsgResponse);

    const newMessageResponse = await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      pusherEvents.NEW_MESSAGE,
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name,
      }
    );

    console.log('newMessageResponse: ', newMessageResponse);

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
