import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { useEffect } from 'react';

export default function usePusher(
  channel: string,
  event: string,
  callback: ({ senderId, senderEmail }: IncomingFriendRequest) => void
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
