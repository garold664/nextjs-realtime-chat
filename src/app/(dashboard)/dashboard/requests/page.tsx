import FriendRequests from '@/components/FriendRequests';
import pusherEvents from '@/helpers/pusherEvents';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { User } from '@/types/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:${pusherEvents.INCOMING_FRIEND_REQUEST}`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = JSON.parse(
        await fetchRedis('get', `user:${senderId}`)
      ) as User;
      return {
        senderId,
        senderEmail: sender.email,
      };
    })
  );
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Friend requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}
