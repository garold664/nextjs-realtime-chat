'use client';
import { chatHrefConstructor } from '@/lib/util';
import { Message, User } from '@/types/db';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
              className="text-xs font-semibold leading-6 text-gray-400"
            >
              {friend.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
