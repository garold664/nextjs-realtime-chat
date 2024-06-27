import Button from './components/ui/Button';

export default function Home() {
  return (
    <div className="text-3xl text-blue-500">
      Home
      <Button size={'sm'} variant={'ghost'}>
        Hello
      </Button>
    </div>
  );
}
