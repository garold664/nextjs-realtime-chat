'use client';

import usePusher from '@/hooks/usePusher';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export const iconWrapperClasses =
  'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white';
interface FriendRequestSidebarOptionsProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}
export default function FriendRequestSidebarOptions({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestSidebarOptionsProps) {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );
  const friendRequestsHandler = () => {
    setUnseenRequestCount((prev) => prev + 1);
  };

  const addFriendHandler = () => {
    setUnseenRequestCount((prev) => prev - 1);
  };

  usePusher(
    `user:${sessionId}:incoming_friend_requests`,
    'incoming_friend_request',
    friendRequestsHandler
  );
  usePusher(`user:${sessionId}:friends`, 'new-friend', addFriendHandler);

  // useEffect(() => {
  //   pusherClient.subscribe(
  //     toPusherKey(`user:${sessionId}:incoming_friend_requests`)
  //   );

  //   const friendRequestsHandler = () => {
  //     setUnseenRequestCount((prev) => prev + 1);
  //   };
  //   pusherClient.bind('incoming_friend_request', friendRequestsHandler);

  //   return () => {
  //     pusherClient.unsubscribe(
  //       toPusherKey(`user:${sessionId}:incoming_friend_requests`)
  //     );

  //     pusherClient.unbind('incoming_friend_request', friendRequestsHandler);
  //   };
  // }, []);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className={iconWrapperClasses}>
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unseenRequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
}
