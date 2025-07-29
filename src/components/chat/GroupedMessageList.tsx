import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow, format, isSameDay } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  message_type: string;
  attachment_url?: string;
  chat_id: string;
  part_title?: string;
  part_make?: string;
  part_model?: string;
}

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  part_id?: string;
  buyer_unread_count: number;
  seller_unread_count: number;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  part_info?: {
    title: string;
    make: string;
    model: string;
  };
}

interface GroupedMessageListProps {
  messages: Message[];
  chats: Chat[];
  currentUserId: string | undefined;
}

const GroupedMessageList = ({ messages, chats, currentUserId }: GroupedMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPartInfo = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.part_info;
  };

  const shouldShowPartSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    return currentMessage.chat_id !== previousMessage.chat_id;
  };

  const shouldShowTimestamp = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentTime = new Date(currentMessage.created_at);
    const previousTime = new Date(previousMessage.created_at);
    
    return !isSameDay(currentTime, previousTime) || 
           (currentTime.getTime() - previousTime.getTime()) > 30 * 60 * 1000; // 30 minutes
  };

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const isCurrentUser = message.sender_id === currentUserId;
        const showPartSeparator = shouldShowPartSeparator(message, previousMessage);
        const showTimestamp = shouldShowTimestamp(message, previousMessage);
        const partInfo = getPartInfo(message.chat_id);

        return (
          <div key={message.id}>
            {/* Part separator */}
            {showPartSeparator && partInfo && (
              <div className="flex items-center justify-center py-3">
                <div className="bg-gray-100 px-4 py-2 rounded-full">
                  <p className="text-sm font-medium text-gray-700">
                    {partInfo.make} {partInfo.model} - {partInfo.title}
                  </p>
                </div>
              </div>
            )}

            {/* Timestamp separator */}
            {showTimestamp && (
              <div className="flex items-center justify-center py-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {format(new Date(message.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            {/* Message */}
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
              {!isCurrentUser && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                    {message.sender_id.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  {message.message_type === 'image' && message.attachment_url ? (
                    <div className="space-y-2">
                      <img
                        src={message.attachment_url}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                
                <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default GroupedMessageList;