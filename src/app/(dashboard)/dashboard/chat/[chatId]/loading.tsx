import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function AddFriendLoading() {
  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                <Skeleton height={20} width={300} />
              </span>
            </div>

            <span className="text-sm text-gray-600">
              <Skeleton height={20} width={300} />
            </span>
          </div>
        </div>
      </div>

      <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      ></div>
      <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <Skeleton className="block h-full" width={250} />

          <div
            // onClick={() => textareaRef.current?.focus()}
            className="py-2"
            aria-hidden="true"
          >
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>

          <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <Skeleton height={50} width={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
