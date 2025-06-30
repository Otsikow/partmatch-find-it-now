
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, DollarSign } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import { format } from 'date-fns';

interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  part_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  buyer?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  seller?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  part?: {
    title: string;
    make: string;
    model: string;
    year: number;
  };
}

interface OrderCardProps {
  order: Order;
  currentUserId: string;
  userType: 'buyer' | 'seller';
}

const OrderCard = ({ order, currentUserId, userType }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const otherUser = userType === 'buyer' ? order.seller : order.buyer;
  const otherUserId = userType === 'buyer' ? order.seller_id : order.buyer_id;
  const otherUserName = otherUser 
    ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'User'
    : 'User';

  const isActive = ['pending', 'confirmed'].includes(order.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {order.part && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{order.part.title} - {order.part.make} {order.part.model} ({order.part.year})</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">{order.currency} {order.total_amount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
        </div>

        <div className="pt-3 border-t flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">
              {userType === 'buyer' ? 'Seller' : 'Buyer'}: {otherUserName}
            </p>
          </div>
          
          {isActive && (
            <ChatButton
              sellerId={userType === 'buyer' ? otherUserId : currentUserId}
              partId={order.part_id}
              size="sm"
              variant="outline"
              className="text-purple-700 border-purple-600 hover:bg-purple-50"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
