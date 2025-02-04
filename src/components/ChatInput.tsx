'use client';

import { useRef, useState } from 'react';
import Button from './ui/Button';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { User } from '@/types/db';
import axios from 'axios';
import { text } from 'stream/consumers';
import toast from 'react-hot-toast';

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}
export default function ChatInput({ chatPartner, chatId }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      await axios.post('/api/friends/message/send', {
        text: input,
        chatId,
      });
      setInput('');
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className="border-t border-secondary-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-secondary-300 focus-within:ring-2 focus-within:ring-primary-600">
        <ReactTextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-secondary-900 placeholder:text-secondary-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              isLoading={isLoading}
              onClick={() => sendMessage()}
              type="submit"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
