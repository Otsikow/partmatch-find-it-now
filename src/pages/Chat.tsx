
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '@/components/chat/ChatList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import PageHeader from '@/components/PageHeader';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader 
        title="Messages"
        subtitle="Chat with buyers and sellers"
        showBackButton={true}
        backTo="/dashboard"
        showHomeButton={true}
      />
      
      <div className={`flex-1 flex overflow-hidden ${isMobile ? 'pb-20' : ''}`}>
        <div className="w-full max-w-7xl mx-auto flex h-full">
          {/* Chat List - Hidden on mobile when chat is selected */}
          <div className={`w-full lg:w-1/3 xl:w-1/4 border-r border-gray-200 bg-white ${selectedChatId && isMobile ? 'hidden' : 'block'}`}>
            <ChatList onChatSelect={handleChatSelect} />
          </div>
          
          {/* Chat Interface - Only show when chat is selected */}
          {selectedChatId && (
            <div className="flex-1 bg-white">
              <ChatInterface 
                chatId={selectedChatId} 
                onBack={handleBack}
              />
            </div>
          )}
          
          {/* Placeholder when no chat selected (desktop only) */}
          {!selectedChatId && !isMobile && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
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
