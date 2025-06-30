
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ChatNotificationBadge = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('buyer_unread_count, seller_unread_count, buyer_id, seller_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (error) throw error;

      const totalUnread = data?.reduce((sum, chat) => {
        return sum + (chat.buyer_id === user.id ? chat.buyer_unread_count : chat.seller_unread_count);
      }, 0) || 0;

      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [user?.id]);

  // Set up real-time subscription for unread count updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `or(buyer_id.eq.${user.id},seller_id.eq.${user.id})`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (unreadCount === 0) return null;

  return (
    <Badge className="bg-red-500 text-white text-xs ml-1">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default ChatNotificationBadge;
