
import React, { useState, useRef } from 'react';
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
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

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

  const updateTypingStatus = async (typing: boolean) => {
    if (!userId) return;

    try {
      await supabase
        .from('user_chat_status')
        .upsert({
          user_id: userId,
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

    onTyping();
  };

  return (
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
  );
};

export default MessageInput;
