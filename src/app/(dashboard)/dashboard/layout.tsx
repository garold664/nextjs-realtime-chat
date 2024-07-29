import FriendRequestSidebarOptions, {
  iconWrapperClasses,
} from '@/components/FriendRequestSidebarOptions';
import { Icons } from '@/components/Icons';
import MobileChatLayout from '@/components/MobileChatLayout';
import SidebarChatList from '@/components/SidebarChatList';
import SignOutButton from '@/components/SignOutButton';
import getFriendsByUserId from '@/helpers/get-friends-by-user-id';
import pusherEvents from '@/helpers/pusherEvents';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { User } from '@/types/db';
import { SidebarOption } from '@/types/typing';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
];

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:${pusherEvents.INCOMING_FRIEND_REQUEST}`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          unseenRequestCount={unseenRequestCount}
          sidebarOptions={sidebarOptions}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-5 overflow-y-auto border-r border-slate-400 bg-white px-6">
        <Link
          href={'/dashboard/'}
          className="flex h-16 shrink-0 items-center justify-center"
        >
          <Icons.Logo className="h-8 w-8" />
        </Link>
        {friends.length > 0 && (
          <div className="text-xs font-semibold leading-6 text-secondary-400">
            Your chats
          </div>
        )}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-secondary-400">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className={iconWrapperClasses}>
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-secondary-900">
                <div className="relative h-8 w-8 bg-secondary-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || '/images/avatar.png'}
                    alt="Your profile picture"
                  />
                </div>

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>

      <div className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </div>
    </div>
  );
}
