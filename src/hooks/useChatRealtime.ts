
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  message_type: string;
  attachment_url?: string;
}

interface UseChatRealtimeProps {
  chatId: string;
  userId: string | undefined;
  onNewMessage: (message: Message) => void;
  onMarkAsRead: () => void;
}

export const useChatRealtime = ({ chatId, userId, onNewMessage, onMarkAsRead }: UseChatRealtimeProps) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!chatId || !userId) return;

    // Prevent duplicate subscriptions
    if (isSubscribedRef.current) {
      console.log('⚠️ Subscription already active, skipping');
      return;
    }

    console.log('🚀 Setting up real-time subscription for chat:', chatId);

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create a unique channel name to avoid conflicts
    const channelName = `chat_messages_${chatId}_${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('🔥 New message received via real-time:', payload);
          const newMessage = payload.new as Message;
          
          // Add the message to local state immediately
          onNewMessage(newMessage);
          
          // Mark as read if not sent by current user (with minimal delay)
          if (newMessage.sender_id !== userId) {
            setTimeout(() => onMarkAsRead(), 50);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates for chat:', chatId);
          isSubscribedRef.current = true;
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel subscription error for chat:', chatId);
          isSubscribedRef.current = false;
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Channel subscription timed out for chat:', chatId);
          isSubscribedRef.current = false;
          
          // Don't attempt immediate resubscription to avoid loops
          // Let the effect cleanup and restart naturally
        } else if (status === 'CLOSED') {
          console.log('📪 Channel subscription closed for chat:', chatId);
          isSubscribedRef.current = false;
        }
      });

    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up real-time subscription for chat:', chatId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [chatId, userId]); // Removed onNewMessage and onMarkAsRead from dependencies to prevent re-subscriptions

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        console.log('🧹 Component unmounting, final cleanup');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, []);
};
