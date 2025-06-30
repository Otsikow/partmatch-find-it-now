
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
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
    <CardHeader className="pb-3 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-8 w-8 hover:bg-purple-100"
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
              <CardTitle className="text-lg font-medium truncate">
                {otherUser?.first_name} {otherUser?.last_name}
              </CardTitle>
              {otherUser?.is_verified && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Verified {otherUser.user_type}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 capitalize">
              {otherUser?.user_type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {otherUser?.phone && (
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
  );
};

export default ChatHeader;
