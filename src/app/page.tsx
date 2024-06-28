import Button from './components/ui/Button';
import { db } from './components/ui/lib/db';

export default async function Home() {
  await db.set('hello', 'world');
  return <div className="text-3xl text-blue-500">Home</div>;
}
