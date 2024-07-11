import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { ExtendedMessage, Message, User } from '@/types/db';
import { useEffect } from 'react';

type CallbackType =
  | (({ senderId, senderEmail }: IncomingFriendRequest) => void)
  | ((message: Message) => void)
  | ((message: ExtendedMessage) => void)
  | ((user: User) => void);

export default function usePusher(action: {
  channel: string;
  event: string;
  callback: CallbackType;
  pathname?: string | null;
}) {
  useEffect(() => {
    // console.log('usePusher useEffect called');
    pusherClient.subscribe(toPusherKey(action.channel));

    pusherClient.bind(action.event, action.callback);

    return () => {
      // console.log('usePusher useEffect return called');
      pusherClient.unsubscribe(toPusherKey(action.channel));

      pusherClient.unbind(action.event, action.callback);
    };
  }, [action]);
}
