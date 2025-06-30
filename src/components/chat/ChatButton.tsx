
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
  children?: React.ReactNode;
}

const ChatButton = ({ 
  sellerId, 
  partId, 
  className = "", 
  size = "default",
  variant = "default",
  children
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
      console.log('Starting chat with seller:', sellerId, 'for part:', partId);
      
      // Search for existing chat (properly handle null part_id)
      let chatQuery = supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId);

      if (partId) {
        chatQuery = chatQuery.eq('part_id', partId);
      } else {
        chatQuery = chatQuery.is('part_id', null);
      }

      const { data: existingChat, error: searchError } = await chatQuery.maybeSingle();

      if (searchError) {
        console.error('Error searching for existing chat:', searchError);
        throw searchError;
      }

      let chatId = existingChat?.id;
      console.log('Existing chat found:', existingChat);

      // Create new chat if it doesn't exist
      if (!chatId) {
        console.log('Creating new chat...');
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            part_id: partId || null
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating chat:', createError);
          throw createError;
        }
        
        console.log('New chat created:', newChat);
        chatId = newChat.id;
        
        toast({
          title: "Chat Started",
          description: "New conversation created successfully",
        });
      } else {
        toast({
          title: "Chat Opened",
          description: "Opening existing conversation",
        });
      }

      // Navigate to chat
      console.log('Navigating to chat:', chatId);
      navigate(`/chat?id=${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
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
      {children || "Chat with Seller"}
    </Button>
  );
};

export default ChatButton;
