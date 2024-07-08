import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArrayValidator } from '@/lib/validations/message';
import { Message, User } from '@/types/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.toReversed();
    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = params;

  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split('--');

  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = userId1 !== user.id ? userId1 : userId2;

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initMessages = await getChatMessages(chatId);

  return <div>{chatId}</div>;
}
