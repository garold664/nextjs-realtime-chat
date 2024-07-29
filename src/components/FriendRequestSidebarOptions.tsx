'use client';

import pusherEvents from '@/helpers/pusherEvents';
import usePusher from '@/hooks/usePusher';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export const iconWrapperClasses =
  'text-secondary-400 border-secondary-200 group-hover:border-primary-600 group-hover:text-primary-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white';
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

  // const removeFriendHandler = () => {
  //   setUnseenRequestCount((prev) => prev - 1);
  // };

  // usePusher(
  //   {
  //     channel: `user:${sessionId}:incoming_friend_requests`,
  //     event: 'incoming_friend_request',
  //     callback: friendRequestsHandler,
  //   },
  //   {
  //     channel: `user:${sessionId}:friends`,
  //     event: 'new-friend',
  //     callback: addFriendHandler,
  //   },
  //   {
  //     channel: `user:${sessionId}:friends`,
  //     event: 'deny-friend',
  //     callback: removeFriendHandler,
  //   }
  // );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:${pusherEvents.INCOMING_FRIEND_REQUEST}`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };

    pusherClient.bind(
      pusherEvents.INCOMING_FRIEND_REQUEST,
      friendRequestHandler
    );
    pusherClient.bind(pusherEvents.NEW_FRIEND, addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:${pusherEvents.INCOMING_FRIEND_REQUEST}`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind(pusherEvents.NEW_FRIEND, addedFriendHandler);
      pusherClient.unbind(
        pusherEvents.INCOMING_FRIEND_REQUEST,
        friendRequestHandler
      );
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className={iconWrapperClasses}>
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>

      {unseenRequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-primary-600">
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
}
