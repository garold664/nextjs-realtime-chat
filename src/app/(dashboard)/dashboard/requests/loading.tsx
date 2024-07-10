import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function AddFriendLoading() {
  return (
    <div className="flex flex-col gap-5 mt-8">
      <Skeleton className="" height={50} width={350} />
      <Skeleton className="" height={40} width={600} />
      <Skeleton className="" height={40} width={600} />
      <Skeleton className="" height={40} width={600} />
    </div>
  );
}
