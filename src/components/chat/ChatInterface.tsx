
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatData } from '@/hooks/useChatData';
import { useChatRealtime } from '@/hooks/useChatRealtime';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatInterfaceProps {
  chatId: string;
  onBack: () => void;
}

const ChatInterface = ({ chatId, onBack }: ChatInterfaceProps) => {
  const { user } = useAuth();
  
  const {
    messages,
    chatInfo,
    otherUser,
    addMessage,
    markMessagesAsRead
  } = useChatData(chatId, user?.id);

  // Set up real-time subscription with stable callbacks
  useChatRealtime({
    chatId,
    userId: user?.id,
    onNewMessage: addMessage,
    onMarkAsRead: markMessagesAsRead
  });

  const handleTyping = () => {
    // Typing indicator logic can be implemented here if needed
  };

  if (!chatInfo || !otherUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader otherUser={otherUser} onBack={onBack} />

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} currentUserId={user?.id} />
        <MessageInput 
          chatId={chatId} 
          userId={user?.id} 
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
