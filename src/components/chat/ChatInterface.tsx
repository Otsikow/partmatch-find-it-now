import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Phone, MoreVertical, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface ChatInterfaceProps {
  chatId: string;
  onBack: () => void;
}

const ChatInterface = ({ chatId, onBack }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      const otherUserId = chatData.buyer_id === user?.id ? chatData.seller_id : chatData.buyer_id;
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
    if (!user?.id) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        chat_id_param: chatId,
        user_id_param: user.id
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      toast({
        title: "Success",
        description: "Message sent",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const updateTypingStatus = async (typing: boolean) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('user_chat_status')
        .upsert({
          user_id: user.id,
          chat_id: chatId,
          is_typing: typing,
          last_seen: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 1000);
  };

  useEffect(() => {
    if (chatId && user?.id) {
      fetchMessages();
      fetchChatInfo();
      markMessagesAsRead();
    }
  }, [chatId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!chatId) return;

    const messagesChannel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark as read if not sent by current user
          if (newMessage.sender_id !== user?.id) {
            markMessagesAsRead();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_chat_status',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          // Handle typing indicators
          console.log('Typing status updated:', payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [chatId, user?.id]);

  if (!chatInfo || !otherUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <Card className="h-full flex flex-col bg-white shadow-lg">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm bg-purple-100 text-purple-700">
                {getInitials(otherUser.first_name, otherUser.last_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-medium truncate">
                  {otherUser.first_name} {otherUser.last_name}
                </CardTitle>
                {otherUser.is_verified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Verified {otherUser.user_type}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 capitalize">
                {otherUser.user_type}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {otherUser.phone && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-100">
                <Phone className="h-4 w-4 text-purple-600" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-100">
              <MoreVertical className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender_id === user?.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ml-4'
                      : 'bg-white text-gray-900 mr-4 border'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender_id === user?.id ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="min-h-[44px] max-h-32 resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                disabled={loading}
                rows={1}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 h-11"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isTyping && (
            <p className="text-xs text-gray-500 mt-2">You are typing...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
