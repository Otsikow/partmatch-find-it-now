
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ChatList from '@/components/chat/ChatList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Get chat ID from URL params
    const chatId = searchParams.get('id');
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [user, searchParams, navigate]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Update URL without triggering navigation
    window.history.replaceState({}, '', `/chat?id=${chatId}`);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    window.history.replaceState({}, '', '/chat');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 font-inter">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={handleGoBack} 
              className="flex items-center gap-2 bg-white/70 hover:bg-white/90 border-purple-200 hover:border-purple-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              {!isMobile && <span>Back</span>}
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                  Messages
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-crimson">
                  Chat with buyers and sellers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-200px)]">
          {/* Chat List - Hide on mobile when chat is selected */}
          <div className={`lg:col-span-1 ${isMobile && selectedChatId ? 'hidden' : ''}`}>
            <ChatList onChatSelect={handleChatSelect} />
          </div>
          
          {/* Chat Interface */}
          <div className={`lg:col-span-2 ${isMobile && !selectedChatId ? 'hidden' : ''}`}>
            {selectedChatId ? (
              <ChatInterface 
                chatId={selectedChatId} 
                onBack={isMobile ? handleBackToList : handleGoBack}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a chat from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
