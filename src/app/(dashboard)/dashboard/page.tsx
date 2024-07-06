'use client';
import Button from '@/components/ui/Button';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';

const Page = () => {
  // const session = await getServerSession(authOptions);

  function handleSignOut() {
    signOut();
  }
  // return <pre>{JSON.stringify(session)}</pre>;
  return (
    <div>
      <h1 className="text-5xl font-bold text-center p-5 underline underline-offset-8">
        Dashboard
      </h1>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};

export default Page;
