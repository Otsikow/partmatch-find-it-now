
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X, Image as ImageIcon } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !userId || loading || uploading) return;

    setLoading(true);
    setUploading(true);
    
    try {
      let attachmentUrl = null;
      let messageContent = newMessage.trim();
      let messageType = 'text';

      // Upload image if selected
      if (selectedImage) {
        attachmentUrl = await uploadImage(selectedImage);
        if (!attachmentUrl) {
          setLoading(false);
          setUploading(false);
          return;
        }
        messageType = 'image';
        if (!messageContent) {
          messageContent = '📷 Image';
        }
      }

      console.log('📤 Sending message:', { chatId, userId, content: messageContent, messageType, attachmentUrl });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          content: messageContent,
          message_type: messageType,
          attachment_url: attachmentUrl
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

          const notificationMessage = messageType === 'image' 
            ? `${senderName} sent you an image${messageContent !== '📷 Image' ? `: ${messageContent}` : ''}`
            : `${senderName} sent you a message: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}"`;

          await supabase
            .from('user_notifications')
            .insert({
              user_id: recipientId,
              type: 'new_message',
              message: notificationMessage,
              read: false
            });

          console.log('✅ Notification created for recipient:', recipientId);
        }
      } catch (notificationError) {
        console.error('❌ Error creating notification:', notificationError);
        // Don't throw here - message was sent successfully
      }

      setNewMessage('');
      clearImageSelection();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setUploading(false);
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
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-200">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={clearImageSelection}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
      )}

      <div className={`flex items-end gap-3 ${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
        <div className="flex-1">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder={selectedImage ? "Add a caption (optional)..." : "Type your message..."}
            className={`resize-none border-gray-300 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 ${
              isMobile 
                ? 'min-h-[48px] max-h-24 text-base' 
                : 'min-h-[48px] max-h-32'
            }`}
            disabled={loading || uploading}
            rows={1}
          />
        </div>

        {/* Image Upload Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || uploading}
          variant="outline"
          size={isMobile ? "mobile-default" : "default"}
          className={`border-gray-300 hover:border-gray-400 transition-all duration-200 ${
            isMobile ? 'min-w-[48px] min-h-[48px] rounded-xl' : 'px-4 py-3 h-12 rounded-xl'
          }`}
        >
          <ImageIcon className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          onClick={sendMessage}
          disabled={(!newMessage.trim() && !selectedImage) || loading || uploading}
          size={isMobile ? "mobile-default" : "default"}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md transition-all duration-200 active:scale-95 ${
            isMobile ? 'min-w-[48px] min-h-[48px] rounded-xl' : 'px-6 py-3 h-12 rounded-xl'
          }`}
        >
          {loading || uploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;
