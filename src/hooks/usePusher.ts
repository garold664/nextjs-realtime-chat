import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/util';
import { ExtendedMessage, Message, User } from '@/types/db';
import { useEffect } from 'react';

type CallbackType =
  | (({ senderId, senderEmail }: IncomingFriendRequest) => void)
  | ((message: Message) => void)
  | ((message: ExtendedMessage) => void)
  | ((user: User) => void);

interface UsePusherAction {
  channel: string;
  event: string;
  callback: CallbackType;
  pathname?: string | null;
}

let intervalId: Record<string, NodeJS.Timer | null> = {};

// function repeat(event: string) {
//   intervalId[event] = setInterval(() => {
//     console.log(event);
//   }, 1000);
// }

export default function usePusher(...actions: UsePusherAction[]) {
  const stringifiedActions: string[] = [];

  actions.forEach((action) => {
    stringifiedActions.push(JSON.stringify(action));
  });
  const deps = [...stringifiedActions];
  // console.log(intervalId);
  useEffect(() => {
    for (const action of actions) {
      // repeat(action.event);
      pusherClient.subscribe(toPusherKey(action.channel));

      pusherClient.bind(action.event, action.callback);
    }
    return () => {
      for (const action of actions) {
        // clearInterval(intervalId[action.event]);
        // intervalId[action.event] = null;
        // console.log('usePusher useEffect return called');
        pusherClient.unsubscribe(toPusherKey(action.channel));

        pusherClient.unbind(action.event, action.callback);
      }
    };
  }, deps);
}
