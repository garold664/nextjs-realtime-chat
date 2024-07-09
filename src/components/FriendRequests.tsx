'use client';

import usePusher from '@/hooks/usePusher';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

export default function FriendRequests({
  incomingFriendRequests,
  sessionId,
}: FriendRequestsProps) {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const router = useRouter();

  const friendRequestsHandler = ({
    senderId,
    senderEmail,
  }: IncomingFriendRequest) => {
    setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
  };

  usePusher(
    `user:${sessionId}:incoming_friend_requests`,
    'incoming_friend_request',
    friendRequestsHandler
  );

  // useEffect(() => {
  //   pusherClient.subscribe(
  //     toPusherKey(`user:${sessionId}:incoming_friend_requests`)
  //   );

  //   const friendRequestsHandler = ({
  //     senderId,
  //     senderEmail,
  //   }: IncomingFriendRequest) => {
  //     setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
  //   };
  //   pusherClient.bind('incoming_friend_request', friendRequestsHandler);

  //   return () => {
  //     pusherClient.unsubscribe(
  //       toPusherKey(`user:${sessionId}:incoming_friend_requests`)
  //     );

  //     pusherClient.unbind('incoming_friend_request', friendRequestsHandler);
  //   };
  // }, [incomingFriendRequests]);

  const handleFriendRequest = async (
    action: 'accept' | 'deny',
    senderId: string
  ) => {
    await axios.post(`/api/friends/${action}`, { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">No friend requests yet...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              onClick={() => handleFriendRequest('accept', request.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => handleFriendRequest('deny', request.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
}
