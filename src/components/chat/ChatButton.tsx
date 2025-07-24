
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ChatButtonProps {
  sellerId?: string;
  buyerId?: string;
  partId?: string;
  offerId?: string;
  offerInfo?: {
    price: number;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    message?: string;
  };
  className?: string;
  size?: "sm" | "default" | "lg" | "mobile-sm" | "mobile-default" | "mobile-lg";
  variant?: "default" | "outline" | "ghost";
  children?: React.ReactNode;
}

const ChatButton = ({ 
  sellerId, 
  buyerId,
  partId, 
  offerId,
  offerInfo,
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

    // Determine the other user ID based on who is initiating the chat
    const otherUserId = sellerId || buyerId;
    
    if (!otherUserId) {
      toast({
        title: "Error",
        description: "Unable to determine chat recipient",
        variant: "destructive"
      });
      return;
    }

    if (user.id === otherUserId) {
      toast({
        title: "Cannot Chat",
        description: "You cannot start a conversation with yourself",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Starting chat with user:', otherUserId, 'for part:', partId, 'offer:', offerId);
      
      // Determine buyer and seller based on who is initiating the chat
      const chatBuyerId = buyerId ? user.id : (sellerId ? otherUserId : user.id);
      const chatSellerId = sellerId ? (sellerId === user.id ? user.id : sellerId) : (buyerId ? buyerId : otherUserId);
      
      // Search for existing chat
      let chatQuery = supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', chatBuyerId)
        .eq('seller_id', chatSellerId);

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
            buyer_id: chatBuyerId,
            seller_id: chatSellerId,
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
        
        // If there's offer info, send a prepopulated message
        if (offerInfo && offerId) {
          const prepopulatedMessage = `Hi! I'd like to discuss my offer for the ${offerInfo.part_needed} for your ${offerInfo.car_make} ${offerInfo.car_model} ${offerInfo.car_year}. I offered GHS ${offerInfo.price}.${offerInfo.message ? ` My message: "${offerInfo.message}"` : ''}`;
          
          await supabase
            .from('messages')
            .insert({
              chat_id: chatId,
              sender_id: user.id,
              content: prepopulatedMessage
            });
        }
        
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
      {children || (sellerId ? "Chat" : "Chat with Buyer")}
    </Button>
  );
};

export default ChatButton;
