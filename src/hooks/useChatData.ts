
import { useState, useEffect } from 'react';
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
}

interface ChatUser {
  id: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  is_verified: boolean;
  phone?: string;
}

export const useChatData = (chatId: string, userId: string | undefined) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const fetchChatInfo = async () => {
    try {
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (chatError) throw chatError;
      setChatInfo(chatData);

      // Fetch other user info
      const otherUserId = chatData.buyer_id === userId ? chatData.seller_id : chatData.buyer_id;
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();

      if (userError) throw userError;
      setOtherUser(userData);
    } catch (error) {
      console.error('Error fetching chat info:', error);
      toast({
        title: "Error",
        description: "Failed to load chat information",
        variant: "destructive"
      });
    }
  };

  const markMessagesAsRead = async () => {
    if (!userId) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        chat_id_param: chatId,
        user_id_param: userId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const addMessage = (newMessage: Message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  };

  useEffect(() => {
    if (chatId && userId) {
      fetchMessages();
      fetchChatInfo();
      markMessagesAsRead();
    }
  }, [chatId, userId]);

  return {
    messages,
    chatInfo,
    otherUser,
    addMessage,
    markMessagesAsRead,
    refetchMessages: fetchMessages
  };
};
