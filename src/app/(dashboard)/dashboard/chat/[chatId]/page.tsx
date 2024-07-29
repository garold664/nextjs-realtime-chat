import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArrayValidator } from '@/lib/validations/message';
import { Message, User } from '@/types/db';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
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

  const chatPartner = JSON.parse(
    await fetchRedis('get', `user:${chatPartnerId}`)
  ) as User;

  const initialMessages = await getChatMessages(chatId);

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-secondary-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image || '/images/avatar.png'}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-secondary-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-secondary-600">
              {chatPartner.email}
            </span>
          </div>
        </div>
      </div>

      <Messages
        sessionId={user.id}
        chatId={chatId}
        initialMessages={initialMessages}
        chatPartnerImage={chatPartner.image}
        sessionImage={user.image}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
  );
}
