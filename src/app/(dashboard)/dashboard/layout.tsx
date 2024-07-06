import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }
  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-5 overflow-y-auto border-r border-slate-400 bg-white px-6">
        <Link
          href={'/dashboard/'}
          className="flex h-16 shrink-0 items-center justify-center"
        >
          Dashboard
        </Link>
      </div>
      {children}
    </div>
  );
}
