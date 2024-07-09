'use client';

import { cn } from '@/lib/util';
import { Message } from '@/types/db';
import { useRef, useState } from 'react';

import { format } from 'date-fns';
import Image from 'next/image';

// b2e8d6a0-d002-4acb-9463-eb97d06c989d--c561391a-bcb5-4e28-aca7-7c91468e0c14

// const fakeMessages = [
//   {
//     id: '1',
//     senderId: 'b2e8d6a0-d002-4acb-9463-eb97d06c989d',
//     text: 'Lorem  ipsum dolores ',
//     timestamp: '1',
//   },
//   {
//     id: '2',
//     senderId: 'c561391a-bcb5-4e28-aca7-7c91468e0c14',
//     text: 'Lorem  ipsum dolores ',
//     timestamp: '1',
//   },
//   {
//     id: '3',
//     senderId: 'b2e8d6a0-d002-4acb-9463-eb97d06c989d',
//     text: 'Lorem  ipsum dolores ',
//     timestamp: '1',
//   },
//   {
//     id: '4',
//     senderId: 'b2e8d6a0-d002-4acb-9463-eb97d06c989d',
//     text: 'Lorem  ipsum dolores ',
//     timestamp: '1',
//   },
//   {
//     id: '5',
//     senderId: 'c561391a-bcb5-4e28-aca7-7c91468e0c14',
//     text: 'Lorem  ipsum dolores ',
//     timestamp: '1',
//   },

// ];

// const fakeMessages: Message[] = [];
// const senderIds = [
//   'b2e8d6a0-d002-4acb-9463-eb97d06c989d',
//   'c561391a-bcb5-4e28-aca7-7c91468e0c14',
// ];

// for (let i = 0; i < 100; i++) {
//   const randomNum = Math.random();
//   const senderId = senderIds[randomNum > 0.5 ? 0 : 1];
//   const receiverId = senderIds[randomNum > 0.5 ? 1 : 0];
//   const text = 'Unique message text ';
//   const timestamp = Date.now() + i * 100;
//   fakeMessages.push({
//     id: (i + 1).toString(),
//     senderId,
//     text,
//     timestamp,
//   });
// }

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatPartnerImage: string;
  sessionImage: string | undefined | null;
}

export default function Messages({
  initialMessages,
  sessionId,
  chatPartnerImage,
  sessionImage,
}: MessagesProps) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  // const [messages, setMessages] = useState(initialMessages);
  const [messages, setMessages] = useState(initialMessages);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index]?.senderId;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
                'pl-6': hasNextMessageFromSameUser, // adding space on left side from message
                'pr-6': hasNextMessageFromSameUser && isCurrentUser, // adding space on right side from message
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !isCurrentUser && !hasNextMessageFromSameUser,
                    'rounded-bl-none':
                      isCurrentUser && !hasNextMessageFromSameUser,
                  })}
                >
                  {message.text}{' '}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimestamp(message.timestamp).toString()}
                  </span>
                </span>
              </div>
              {!hasNextMessageFromSameUser && (
                <div
                  className={cn('relative w-6 h-6', {
                    'order-1': !isCurrentUser,
                    'order-2': isCurrentUser,
                  })}
                >
                  <Image
                    src={
                      isCurrentUser
                        ? (sessionImage as string)
                        : chatPartnerImage
                    }
                    alt="avatar"
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={() =>
          scrollDownRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        scroll down
      </button>
    </div>
  );
}
