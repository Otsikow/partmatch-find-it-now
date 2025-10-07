import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  message_type: string;
  attachment_url?: string;
  chat_id: string;
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

interface ChatUser {
  id: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  is_verified: boolean;
  phone?: string;
}

interface GroupedMessage extends Message {
  part_title?: string;
  part_make?: string;
  part_model?: string;
}

export const useGroupedChatData = (otherUserId: string, userId: string | undefined) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<GroupedMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);

  const fetchUserChats = useCallback(async () => {
    if (!userId || !otherUserId) return;

    try {
      console.log('📥 Fetching grouped chats for users:', { userId, otherUserId });
      
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          part:car_parts(title, make, model)
        `)
        .or(`and(buyer_id.eq.${userId},seller_id.eq.${otherUserId}),and(buyer_id.eq.${otherUserId},seller_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log('✅ Grouped chats fetched:', data?.length || 0);
      const formattedChats = data?.map(chat => ({
        ...chat,
        part_info: chat.part
      })) || [];
      
      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching grouped chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chat information",
        variant: "destructive"
      });
    }
  }, [userId, otherUserId, toast]);

  const fetchAllMessages = useCallback(async () => {
    if (!userId || !otherUserId || chats.length === 0) return;

    try {
      console.log('📥 Fetching all messages for chats:', chats.map(c => c.id));
      
      const chatIds = chats.map(chat => chat.id);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          chat:chats(part:car_parts(title, make, model))
        `)
        .in('chat_id', chatIds)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log('✅ All messages fetched:', data?.length || 0);
      
      const formattedMessages = data?.map(message => ({
        ...message,
        part_title: message.chat?.part?.title,
        part_make: message.chat?.part?.make,
        part_model: message.chat?.part?.model
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching all messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  }, [chats, userId, otherUserId, toast]);

  const fetchOtherUser = useCallback(async () => {
    if (!otherUserId) return;

    try {
      console.log('📥 Fetching other user info for:', otherUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        console.error('❌ User profile not found for ID:', otherUserId);
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Other user info fetched:', data);
      setOtherUser(data);
    } catch (error) {
      console.error('Error fetching other user:', error);
      toast({
        title: "Error",
        description: "Failed to load user information",
        variant: "destructive"
      });
    }
  }, [otherUserId, toast]);

  const markAllMessagesAsRead = useCallback(async () => {
    if (!userId || chats.length === 0) return;

    try {
      console.log('📖 Marking all messages as read for chats:', chats.map(c => c.id));
      
      for (const chat of chats) {
        await supabase.rpc('mark_messages_as_read', {
          chat_id_param: chat.id,
          user_id_param: userId
        });
      }
      
      console.log('✅ All messages marked as read');
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [chats, userId]);

  const addMessage = useCallback((newMessage: Message) => {
    console.log('➕ Adding new message to grouped state:', newMessage);
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) {
        console.log('⚠️ Message already exists, skipping');
        return prev;
      }
      
      // Find the chat to get part info
      const chat = chats.find(c => c.id === newMessage.chat_id);
      const enhancedMessage: GroupedMessage = {
        ...newMessage,
        part_title: chat?.part_info?.title,
        part_make: chat?.part_info?.make,
        part_model: chat?.part_info?.model
      };
      
      const newMessages = [...prev, enhancedMessage].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      console.log('✅ Message added to grouped state');
      return newMessages;
    });
  }, [chats]);

  useEffect(() => {
    if (otherUserId && userId) {
      console.log('🚀 Initializing grouped chat data for:', { userId, otherUserId });
      fetchOtherUser();
      fetchUserChats();
    }
  }, [otherUserId, userId, fetchOtherUser, fetchUserChats]);

  useEffect(() => {
    if (chats.length > 0) {
      fetchAllMessages();
      markAllMessagesAsRead();
    }
  }, [chats, fetchAllMessages, markAllMessagesAsRead]);

  // Get the most recent chat for sending new messages
  const getActiveChatId = useCallback((partId?: string) => {
    if (partId) {
      // Find chat for specific part
      const partChat = chats.find(chat => chat.part_id === partId);
      if (partChat) return partChat.id;
    }
    
    // Return most recent chat
    const sortedChats = [...chats].sort((a, b) => 
      new Date(b.last_message_at || b.created_at).getTime() - 
      new Date(a.last_message_at || a.created_at).getTime()
    );
    
    return sortedChats[0]?.id;
  }, [chats]);

  return {
    messages,
    chats,
    otherUser,
    addMessage,
    markAllMessagesAsRead,
    getActiveChatId,
    refetchMessages: fetchAllMessages
  };
};