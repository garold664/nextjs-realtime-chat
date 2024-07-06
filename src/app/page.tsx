import Link from 'next/link';
import Button from '../components/ui/Button';
import { db } from '../lib/db';

export default async function Home() {
  await db.set('hello', 'world!!!');
  return (
    <div className="flex gap-5 text-xl text-blue-500">
      <Link href={'/login'}>Sign in</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      <Link href={'/dashboard/add'}>Add friend</Link>
    </div>
  );
}
