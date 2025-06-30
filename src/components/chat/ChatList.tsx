
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        () => {
          console.log('Chat updated, refetching...');
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
    };
  }, [user?.id]);

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
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start chatting with sellers or buyers</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const unreadCount = getUnreadCount(chat);
              
              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback>
                        {getInitials(chat.other_user?.first_name, chat.other_user?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {chat.other_user?.first_name} {chat.other_user?.last_name}
                          </h4>
                          {chat.other_user?.is_verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {chat.part_info && (
                        <p className="text-xs text-gray-500 mb-1">
                          About: {chat.part_info.make} {chat.part_info.model} - {chat.part_info.title}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.last_message || 'No messages yet'}
                        </p>
                        {chat.last_message_at && (
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatList;
