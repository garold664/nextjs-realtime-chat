import Button from '@/components/ui/Button';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Page = () => {
  // const session = await getServerSession(authOptions);

  // return <pre>{JSON.stringify(session)}</pre>;
  return (
    <div>
      <h1 className="text-5xl font-bold text-center p-5 underline underline-offset-8">
        Dashboard
      </h1>
    </div>
  );
};

export default Page;
