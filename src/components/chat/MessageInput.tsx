
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  chatId: string;
  userId: string | undefined;
  onTyping: () => void;
}

const MessageInput = ({ chatId, userId, onTyping }: MessageInputProps) => {
  const { toast } = useToast();
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
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
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
    </div>
  );
};

export default MessageInput;
