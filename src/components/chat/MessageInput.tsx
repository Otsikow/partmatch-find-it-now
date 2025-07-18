
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageInputProps {
  chatId: string;
  userId: string | undefined;
  onTyping: () => void;
}

const MessageInput = ({ chatId, userId, onTyping }: MessageInputProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || loading) return;

    setLoading(true);
    try {
      console.log('📤 Sending message:', { chatId, userId, content: newMessage.trim() });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          content: newMessage.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully:', data);

      // Create notification for the recipient
      try {
        const { data: chatData } = await supabase
          .from('chats')
          .select('buyer_id, seller_id')
          .eq('id', chatId)
          .single();

        if (chatData) {
          const recipientId = chatData.buyer_id === userId ? chatData.seller_id : chatData.buyer_id;
          
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', userId)
            .single();

          const senderName = senderProfile 
            ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim()
            : 'Someone';

          await supabase
            .from('user_notifications')
            .insert({
              user_id: recipientId,
              type: 'new_message',
              message: `${senderName} sent you a message: "${newMessage.trim().substring(0, 50)}${newMessage.trim().length > 50 ? '...' : ''}"`,
              read: false
            });

          console.log('✅ Notification created for recipient:', recipientId);
        }
      } catch (notificationError) {
        console.error('❌ Error creating notification:', notificationError);
        // Don't throw here - message was sent successfully
      }

      setNewMessage('');
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

  return (
    <div className={`border-t bg-white flex-shrink-0 ${isMobile ? 'p-3 pb-6' : 'p-4'} safe-area-pb`}>
      <div className={`flex items-end gap-3 ${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
        <div className="flex-1">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`resize-none border-gray-300 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 ${
              isMobile 
                ? 'min-h-[48px] max-h-24 text-base' 
                : 'min-h-[48px] max-h-32'
            }`}
            disabled={loading}
            rows={1}
          />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim() || loading}
          size={isMobile ? "mobile-default" : "default"}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md transition-all duration-200 active:scale-95 ${
            isMobile ? 'min-w-[48px] min-h-[48px] rounded-xl' : 'px-6 py-3 h-12 rounded-xl'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
