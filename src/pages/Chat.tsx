
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '@/components/chat/ChatList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    searchParams.get('id')
  );

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setSearchParams({ id: chatId });
  };

  const handleBack = () => {
    if (isMobile) {
      setSelectedChatId(null);
      setSearchParams({});
    } else {
      // On desktop, navigate back to dashboard or previous page
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat List - Hidden on mobile when chat is selected */}
          <div className={`lg:col-span-1 ${selectedChatId && isMobile ? 'hidden' : 'block'}`}>
            <ChatList onChatSelect={handleChatSelect} />
          </div>
          
          {/* Chat Interface - Only show when chat is selected */}
          {selectedChatId && (
            <div className="lg:col-span-2">
              <ChatInterface 
                chatId={selectedChatId} 
                onBack={handleBack}
              />
            </div>
          )}
          
          {/* Placeholder when no chat selected (desktop only) */}
          {!selectedChatId && !isMobile && (
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
