
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MoreVertical, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatUser {
  id: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  is_verified: boolean;
  phone?: string;
}

interface ChatHeaderProps {
  otherUser: ChatUser;
  onBack: () => void;
}

const ChatHeader = ({ otherUser, onBack }: ChatHeaderProps) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 h-8 w-8 hover:bg-gray-100 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarFallback className="text-sm bg-purple-100 text-purple-700">
            {getInitials(otherUser?.first_name, otherUser?.last_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {otherUser?.first_name} {otherUser?.last_name}
            </h3>
            {otherUser?.is_verified && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 capitalize">
            {otherUser?.user_type} • Online
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {otherUser?.phone && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-green-100"
            onClick={() => {
              const cleanPhone = otherUser.phone?.replace(/[^0-9]/g, '');
              const message = `Hi ${otherUser.first_name}! I'd like to discuss about the part on PartMatch.`;
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            <Phone className="h-4 w-4 text-green-600" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
