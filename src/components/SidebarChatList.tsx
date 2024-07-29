'use client';
import usePusher from '@/hooks/usePusher';
import { chatHrefConstructor, toPusherKey } from '@/lib/util';
import { ExtendedMessage, Message, User } from '@/types/db';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';
import { pusherClient } from '@/lib/pusher';
import pusherEvents from '@/helpers/pusherEvents';

interface SidebarChatListProps {
  sessionId: string;
  friends: User[];
}

export default function SidebarChatList({
  sessionId,
  friends,
}: SidebarChatListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  const newFriendHandler = useCallback((newFriend: User) => {
    // console.log('new friend');
    setActiveChats((prev) => [...prev, newFriend]);
  }, []);

  const chatHandler = useCallback(
    (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => {
        return (
          <UnseenChatToast
            t={t}
            senderImg={message.senderImg}
            senderName={message.senderName}
            sessionId={sessionId}
            senderMessage={message.text}
            senderId={message.senderId}
          />
        );
      });

      setUnseenMessages((prev) => [...prev, message]);
    },
    [pathname, sessionId]
  );

  usePusher(
    {
      channel: `user:${sessionId}:chats`,
      event: pusherEvents.NEW_MESSAGE,
      callback: chatHandler,
      pathname,
    },
    {
      channel: `user:${sessionId}:friends`,
      event: pusherEvents.NEW_FRIEND,
      callback: newFriendHandler,
      pathname,
    }
  );

  // useEffect(() => {
  //   pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
  //   pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

  //   const newFriendHandler = (newFriend: User) => {
  //     console.log('received new user', newFriend);
  //     setActiveChats((prev) => [...prev, newFriend]);
  //   };

  //   const chatHandler = (message: ExtendedMessage) => {
  //     const shouldNotify =
  //       pathname !==
  //       `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

  //     if (!shouldNotify) return;

  //     // should be notified
  //     toast.custom((t) => (
  //       <UnseenChatToast
  //         t={t}
  //         sessionId={sessionId}
  //         senderId={message.senderId}
  //         senderImg={message.senderImg}
  //         senderMessage={message.text}
  //         senderName={message.senderName}
  //       />
  //     ));

  //     setUnseenMessages((prev) => [...prev, message]);
  //   };

  //   pusherClient.bind(pusherEvents.NEW_MESSAGE, chatHandler);
  //   pusherClient.bind(pusherEvents.NEW_FRIEND, newFriendHandler);

  //   return () => {
  //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
  //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

  //     pusherClient.unbind(pusherEvents.NEW_MESSAGE, chatHandler);
  //     pusherClient.unbind(pusherEvents.NEW_FRIEND, newFriendHandler);
  //   };
  // }, [pathname, sessionId, router]);

  useEffect(() => {
    //! deleting the message that was seen from the array of unseen messages
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        //! number of unseen messages from one friend
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMessagesCount > 0 && (
                <div className="bg-primary-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
