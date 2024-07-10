'use client';
import usePusher from '@/hooks/usePusher';
import { chatHrefConstructor } from '@/lib/util';
import { ExtendedMessage, Message, User } from '@/types/db';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';

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

  const newFriendHandler = () => {
    router.refresh();
  };

  const chatHandler = (message: ExtendedMessage) => {
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
  };

  usePusher(`user:${sessionId}:chats`, 'new-message', chatHandler, pathname);
  usePusher(
    `user:${sessionId}:friends`,
    'new-friend',
    newFriendHandler,
    pathname
  );

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
      {friends.sort().map((friend) => {
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
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMessagesCount > 0 && (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
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
