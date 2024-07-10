import AddFriendButton from '@/components/ui/AddFriendButton';
import React from 'react';

export default async function page() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <main className="font-bold text-5xl mb-8">
      <h2>Add a friend</h2>
      <AddFriendButton />
    </main>
  );
}
