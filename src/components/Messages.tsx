'use client';

import { cn } from '@/lib/util';
import { Message } from '@/types/db';
import { useCallback, useRef, useState } from 'react';

import { format } from 'date-fns';
import Image from 'next/image';
import usePusher from '@/hooks/usePusher';

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  chatPartnerImage: string;
  sessionImage: string | undefined | null;
}

export default function Messages({
  initialMessages,
  sessionId,
  chatId,
  chatPartnerImage,
  sessionImage,
}: MessagesProps) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  // const [messages, setMessages] = useState(initialMessages);
  const [messages, setMessages] = useState(initialMessages);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  const messageHandler = useCallback(
    (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    },
    [setMessages]
  );

  usePusher(`chat:${chatId}`, 'incoming-message', messageHandler);

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
