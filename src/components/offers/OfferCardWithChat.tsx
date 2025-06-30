
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Package } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import { format } from 'date-fns';

interface Offer {
  id: string;
  request_id: string;
  supplier_id: string;
  buyer_id?: string;
  price: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  contact_unlocked: boolean;
  created_at: string;
  supplier?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
  };
  buyer?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  request?: {
    part_needed: string;
    car_make: string;
    car_model: string;
    car_year: number;
  };
}

interface OfferCardWithChatProps {
  offer: Offer;
  currentUserId: string;
  userType: 'buyer' | 'seller';
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
}

const OfferCardWithChat = ({ 
  offer, 
  currentUserId, 
  userType, 
  onAccept, 
  onReject 
}: OfferCardWithChatProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const otherUser = userType === 'buyer' ? offer.supplier : offer.buyer;
  const otherUserId = userType === 'buyer' ? offer.supplier_id : offer.buyer_id;
  const otherUserName = otherUser 
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'User'
    : 'User';

  const isPending = offer.status === 'pending';
  const isAccepted = offer.status === 'accepted';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {userType === 'buyer' ? 'Offer Received' : 'Offer Sent'}
          </CardTitle>
          <Badge className={getStatusColor(offer.status)}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {offer.request && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>
              {offer.request.part_needed} - {offer.request.car_make} {offer.request.car_model} ({offer.request.car_year})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium text-lg text-green-600">
            GHS {offer.price.toLocaleString()}
          </span>
        </div>

        {offer.message && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{offer.message}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(offer.created_at), 'MMM dd, yyyy')}</span>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm font-medium">
                {userType === 'buyer' ? 'From' : 'To'}: {otherUserName}
              </p>
              {otherUser?.is_verified && (
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {(isPending || isAccepted) && otherUserId && (
              <ChatButton
                sellerId={userType === 'buyer' ? otherUserId : currentUserId}
                size="sm"
                variant="outline"
                className="flex-1"
              />
            )}
            
            {userType === 'buyer' && isPending && (
              <>
                {onAccept && (
                  <Button 
                    size="sm" 
                    onClick={() => onAccept(offer.id)}
                    className="flex-1"
                  >
                    Accept
                  </Button>
                )}
                {onReject && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onReject(offer.id)}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCardWithChat;
