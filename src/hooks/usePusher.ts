import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { ExtendedMessage, Message } from '@/types/db';
import { useEffect } from 'react';

type CallbackType =
  | (({ senderId, senderEmail }: IncomingFriendRequest) => void)
  | ((message: Message) => void)
  | ((message: ExtendedMessage) => void);

export default function usePusher(
  channel: string,
  event: string,
  callback: CallbackType,
  pathname?: string | null
) {
  useEffect(() => {
    console.log('usePusher useEffect called');
    pusherClient.subscribe(toPusherKey(channel));

    pusherClient.bind(event, callback);

    return () => {
      console.log('usePusher useEffect return called');
      pusherClient.unsubscribe(toPusherKey(channel));

      pusherClient.unbind(event, callback);
    };
  }, [pathname, channel, event, callback]);
}
