
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ChatButtonProps {
  sellerId: string;
  partId?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

const ChatButton = ({ 
  sellerId, 
  partId, 
  className = "", 
  size = "default",
  variant = "default"
}: ChatButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChatClick = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start a conversation",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (user.id === sellerId) {
      toast({
        title: "Cannot Chat",
        description: "You cannot start a conversation with yourself",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if chat already exists
      const { data: existingChat, error: searchError } = await supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .eq('part_id', partId || null)
        .maybeSingle();

      if (searchError) throw searchError;

      let chatId = existingChat?.id;

      // Create new chat if it doesn't exist
      if (!chatId) {
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            part_id: partId || null
          })
          .select('id')
          .single();

        if (createError) throw createError;
        chatId = newChat.id;
      }

      // Navigate to chat
      navigate(`/chat?id=${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleChatClick}
      size={size}
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      Chat with Seller
    </Button>
  );
};

export default ChatButton;
