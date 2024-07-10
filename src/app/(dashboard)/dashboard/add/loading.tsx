import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function AddFriendLoading() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="" height={50} width={500} />
      <Skeleton className="" height={10} width={200} />
      <Skeleton className="" height={40} width={700} />
    </div>
  );
}
