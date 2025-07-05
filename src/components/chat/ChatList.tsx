
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatListItem {
  id: string;
  buyer_id: string;
  seller_id: string;
  part_id?: string;
  last_message?: string;
  last_message_at?: string;
  buyer_unread_count: number;
  seller_unread_count: number;
  other_user: {
    id: string;
    first_name?: string;
    last_name?: string;
    user_type: string;
    is_verified: boolean;
  };
  part_info?: {
    title: string;
    make: string;
    model: string;
  };
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
}

const ChatList = ({ onChatSelect }: ChatListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('Fetching chats for user:', user.id);
      
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          buyer:profiles!chats_buyer_id_fkey(id, first_name, last_name, user_type, is_verified),
          seller:profiles!chats_seller_id_fkey(id, first_name, last_name, user_type, is_verified),
          part:car_parts(title, make, model)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching chats:', error);
        throw error;
      }

      console.log('Raw chat data:', data);

      const formattedChats = data?.map(chat => ({
        ...chat,
        other_user: chat.buyer_id === user.id ? chat.seller : chat.buyer,
        part_info: chat.part
      })) || [];

      console.log('Formatted chats:', formattedChats);
      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user?.id]);

  // Set up real-time subscription for chat updates
  useEffect(() => {
    if (!user?.id) return;

    const chatsChannel = supabase
      .channel('user-chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `or(buyer_id.eq.${user.id},seller_id.eq.${user.id})`
        },
        (payload) => {
          console.log('Chat updated:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            setChats(prev => prev.map(chat => 
              chat.id === payload.new.id 
                ? { 
                    ...chat, 
                    ...payload.new,
                    other_user: chat.other_user, // Preserve other_user data
                    part_info: chat.part_info // Preserve part_info data
                  }
                : chat
            ));
          } else {
            fetchChats();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
    };
  }, [user?.id, fetchChats]);

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const otherUserName = `${chat.other_user?.first_name || ''} ${chat.other_user?.last_name || ''}`.toLowerCase();
    const partTitle = chat.part_info?.title?.toLowerCase() || '';
    
    return otherUserName.includes(searchLower) || partTitle.includes(searchLower);
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getUnreadCount = (chat: ChatListItem) => {
    return user?.id === chat.buyer_id ? chat.buyer_unread_count : chat.seller_unread_count;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">No conversations yet</p>
            <p className="text-sm text-center px-4">Start messaging with buyers and sellers to see your chats here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => {
              const unreadCount = getUnreadCount(chat);
              
              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {getInitials(chat.other_user?.first_name, chat.other_user?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {chat.other_user?.first_name} {chat.other_user?.last_name}
                          </h4>
                          {chat.other_user?.is_verified && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </div>
                        {chat.last_message_at && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {chat.part_info && (
                        <p className="text-xs text-gray-500 mb-1">
                          About: {chat.part_info.make} {chat.part_info.model} - {chat.part_info.title}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 truncate">
                        {chat.last_message || 'No messages yet'}
                      </p>
                      
                      <span className="text-xs text-gray-500 capitalize mt-1 inline-block">
                        {chat.other_user?.user_type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
