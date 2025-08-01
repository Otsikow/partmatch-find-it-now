import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupedChatData } from '@/hooks/useGroupedChatData';
import { useChatRealtime } from '@/hooks/useChatRealtime';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './ChatHeader';
import GroupedMessageList from './GroupedMessageList';
import MessageInput from './MessageInput';

interface GroupedChatInterfaceProps {
  otherUserId: string;
  onBack: () => void;
  requestId?: string | null;
  partContext?: string | null;
}

const GroupedChatInterface = ({ otherUserId, onBack, requestId, partContext }: GroupedChatInterfaceProps) => {
  const { user } = useAuth();
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  
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

  // Send initial message with part request context if provided
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (partContext && requestId && activeChatId && user?.id && !initialMessageSent) {
        // Check if there are already messages in this chat
        const hasMessages = messages.length > 0;
        
        if (!hasMessages) {
          const initialMessage = `Hello! I'm interested in your request for: ${partContext}. I may have this part available for you.`;
          
          try {
            const { error } = await supabase
              .from('messages')
              .insert({
                chat_id: activeChatId,
                sender_id: user.id,
                content: initialMessage,
                message_type: 'text'
              });

            if (!error) {
              setInitialMessageSent(true);
            }
          } catch (error) {
            console.error('Error sending initial message:', error);
          }
        }
      }
    };

    if (activeChatId && messages !== undefined) {
      sendInitialMessage();
    }
  }, [activeChatId, partContext, requestId, user?.id, messages, initialMessageSent]);

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
      <ChatHeader otherUser={otherUser} onBack={onBack} partContext={partContext} />

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