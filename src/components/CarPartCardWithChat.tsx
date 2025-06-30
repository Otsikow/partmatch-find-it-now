
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Navigation } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import { format } from 'date-fns';

interface CarPart {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  part_type: string;
  condition: string;
  price: number;
  currency: string;
  description?: string;
  images?: string[];
  address?: string;
  created_at: string;
  supplier_id: string;
  supplier?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
  };
}

interface CarPartCardWithChatProps {
  part: CarPart;
}

const CarPartCardWithChat = ({ part }: CarPartCardWithChatProps) => {
  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  const supplierName = part.supplier 
    ? `${part.supplier.first_name || ''} ${part.supplier.last_name || ''}`.trim() || 'Seller'
    : 'Seller';

  const openDirections = () => {
    if (part.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(part.address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        {part.images && part.images.length > 0 ? (
          <img 
            src={part.images[0]} 
            alt={part.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${part.images && part.images.length > 0 ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-100 text-gray-500`}>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-sm font-medium">Image not available yet</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-xl line-clamp-2 mb-1">{part.title}</h3>
              <p className="text-green-600 font-bold text-xl mb-2">
                {formatPrice(part.price, part.currency)}
              </p>
            </div>
            <Badge className={getConditionColor(part.condition)}>
              {part.condition}
            </Badge>
          </div>

          <div className="text-gray-600 text-sm">
            <p className="font-medium">{part.make} {part.model} ({part.year}) - {part.part_type}</p>
          </div>

          {part.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{part.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {part.address && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{part.address}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(part.created_at), 'MMM dd')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{supplierName}</span>
              {part.supplier?.is_verified && (
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <ChatButton
                sellerId={part.supplier_id}
                partId={part.id}
                size="sm"
                variant="outline"
              />
              {part.address && (
                <Button size="sm" variant="default" onClick={openDirections}>
                  <Navigation className="h-4 w-4 mr-1" />
                  Get Directions
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarPartCardWithChat;
