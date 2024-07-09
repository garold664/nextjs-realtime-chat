import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { Message } from '@/types/db';
import { useEffect } from 'react';

type CallbackType =
  | (({ senderId, senderEmail }: IncomingFriendRequest) => void)
  | ((message: Message) => void);

export default function usePusher(
  channel: string,
  event: string,
  callback: CallbackType
) {
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(channel));

    pusherClient.bind(event, callback);

    return () => {
      pusherClient.unsubscribe(toPusherKey(channel));

      pusherClient.unbind(event, callback);
    };
  }, []);
}
