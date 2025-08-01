
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatList from '@/components/chat/ChatList';
import GroupedChatInterface from '@/components/chat/GroupedChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract part request context from URL parameters
  const requestId = searchParams.get('requestId');
  const partContext = searchParams.get('partContext');

  // Handle both direct userId and chat id parameters
  useEffect(() => {
    const handleUrlParams = async () => {
      const userId = searchParams.get('userId');
      const chatId = searchParams.get('id');
      
      if (userId) {
        // Direct user ID provided
        setSelectedUserId(userId);
      } else if (chatId && user?.id) {
        // Chat ID provided, need to find the other user
        setLoading(true);
        try {
          console.log('🔍 Finding other user from chat ID:', chatId);
          
          const { data: chat, error } = await supabase
            .from('chats')
            .select('buyer_id, seller_id')
            .eq('id', chatId)
            .single();

          if (error) throw error;
          
          // Determine the other user (not the current user)
          const otherUserId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;
          console.log('✅ Found other user:', otherUserId);
          
          setSelectedUserId(otherUserId);
          
          // Update URL to use userId format for consistency
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('id');
          newSearchParams.set('userId', otherUserId);
          setSearchParams(newSearchParams, { replace: true });
          
        } catch (error) {
          console.error('❌ Error finding other user from chat:', error);
          navigate('/dashboard'); // Fallback to dashboard
        } finally {
          setLoading(false);
        }
      }
    };

    handleUrlParams();
  }, [searchParams, user?.id, navigate, setSearchParams]);

  const handleChatSelect = (userId: string) => {
    console.log('🎯 User selected for grouped chat:', userId);
    setSelectedUserId(userId);
    setSearchParams({ userId });
    console.log('📍 URL params updated:', { userId });
  };

  const handleBack = () => {
    if (isMobile) {
      setSelectedUserId(null);
      setSearchParams({});
    } else {
      // On desktop, navigate back to dashboard or previous page
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <PageHeader 
          title="Messages"
          subtitle="Chat with buyers and sellers"
          showBackButton={true}
          backTo="/dashboard"
          showHomeButton={true}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PageHeader 
        title="Messages"
        subtitle="Chat with buyers and sellers"
        showBackButton={true}
        backTo="/dashboard"
        showHomeButton={true}
      />
      
      <div className={`flex-1 flex overflow-hidden ${isMobile ? 'pb-16' : ''}`}>
        <div className="w-full flex h-full">
          {/* Chat List - Responsive width and visibility */}
          <div className={`${
            selectedUserId && isMobile 
              ? 'hidden' 
              : selectedUserId && !isMobile
                ? 'w-80 xl:w-96'
                : 'w-full sm:w-80 md:w-96 lg:w-80 xl:w-96'
          } border-r border-gray-200 bg-white flex-shrink-0 h-full`}>
            <ChatList onChatSelect={handleChatSelect} />
          </div>
          
          {/* Grouped Chat Interface - Optimized for all screen sizes */}
          {selectedUserId && (
            <div className="flex-1 bg-white min-w-0 h-full">
              <GroupedChatInterface 
                otherUserId={selectedUserId} 
                onBack={handleBack}
                requestId={requestId}
                partContext={partContext}
              />
            </div>
          )}
          
          {/* Placeholder when no chat selected (desktop/tablet only) */}
          {!selectedUserId && !isMobile && (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-w-0">
              <div className="text-center text-gray-500 max-w-sm mx-auto px-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Select a conversation</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Choose a chat from the list to start messaging with buyers and sellers</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
