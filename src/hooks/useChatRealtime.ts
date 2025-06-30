
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

  useEffect(() => {
    if (!chatId || !userId) return;

    console.log('Setting up real-time subscription for chat:', chatId);

    // Clean up existing channel
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
    }

    // Create new channel with unique name
    const channelName = `messages-${chatId}-${Date.now()}`;
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
          
          // Add the message to local state
          onNewMessage(newMessage);
          
          // Mark as read if not sent by current user
          if (newMessage.sender_id !== userId) {
            setTimeout(() => onMarkAsRead(), 500);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates for chat:', chatId);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel subscription error for chat:', chatId);
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Channel subscription timed out for chat:', chatId);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId, userId, onNewMessage, onMarkAsRead]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        console.log('🧹 Component unmounting, cleaning up channel');
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);
};
