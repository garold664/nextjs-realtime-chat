import { User } from '@/types/db';
import { fetchRedis } from './redis';

export default async function getFriendsByUserId(userId: string) {
  const friendIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = JSON.parse(
        await fetchRedis('get', `user:${friendId}`)
      ) as User;

      return friend;
    })
  );
  return friends;
}
