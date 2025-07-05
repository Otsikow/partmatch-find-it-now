
import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  message_type: string;
  attachment_url?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-3 py-4' : 'px-4 py-6'} bg-gradient-to-b from-gray-50 to-white`} 
         style={{ maxHeight: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 200px)' }}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        </div>
      ) : (
        <div className={`space-y-3 pb-4 ${isMobile ? 'pb-6' : ''}`}>
          {messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const showTimestamp = index === 0 || 
              (new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime()) > 300000; // 5 minutes
            
            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                )}
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative ${isMobile ? 'max-w-[280px]' : 'max-w-xs sm:max-w-md lg:max-w-lg'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-md'
                      }`}
                    >
                      <p className={`${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed whitespace-pre-wrap break-words`}>
                        {message.content}
                      </p>
                    </div>
                    {/* Message tail */}
                    <div className={`absolute bottom-0 ${
                      isCurrentUser 
                        ? 'right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-purple-600' 
                        : 'left-0 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-white'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
