import React from 'react';

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = params;
  return <div>{chatId}</div>;
}
