import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupedChatData } from '@/hooks/useGroupedChatData';
import { useChatRealtime } from '@/hooks/useChatRealtime';
import ChatHeader from './ChatHeader';
import GroupedMessageList from './GroupedMessageList';
import MessageInput from './MessageInput';

interface GroupedChatInterfaceProps {
  otherUserId: string;
  onBack: () => void;
}

const GroupedChatInterface = ({ otherUserId, onBack }: GroupedChatInterfaceProps) => {
  const { user } = useAuth();
  
  const {
    messages,
    chats,
    otherUser,
    addMessage,
    markAllMessagesAsRead,
    getActiveChatId
  } = useGroupedChatData(otherUserId, user?.id);

  // Get the most recent chat ID for sending messages and real-time subscription
  const activeChatId = getActiveChatId();
  
  useChatRealtime({
    chatId: activeChatId || '',
    userId: user?.id,
    onNewMessage: addMessage,
    onMarkAsRead: markAllMessagesAsRead
  });

  const handleTyping = () => {
    // Typing indicator logic can be implemented here if needed
  };

  if (!otherUser || !activeChatId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <ChatHeader otherUser={otherUser} onBack={onBack} />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <GroupedMessageList 
          messages={messages} 
          chats={chats}
          currentUserId={user?.id} 
        />
        <MessageInput 
          chatId={activeChatId} 
          userId={user?.id} 
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default GroupedChatInterface;