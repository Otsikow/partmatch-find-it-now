import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import ChatButton from './chat/ChatButton';

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
  latitude?: number;
  longitude?: number;
  distance?: number;
  created_at: string;
  supplier_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
    rating?: number;
    total_ratings?: number;
    profile_photo_url?: string;
  };
}

interface CarPartCardWithChatProps {
  part: CarPart;
  showDistance?: boolean;
  distanceText?: string;
}

const CarPartCardWithChat = ({ part, showDistance, distanceText }: CarPartCardWithChatProps) => {
  // This is a stub implementation. In practice, you would modify the existing component
  // to include distance information.

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Image section */}
      {part.images && part.images.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={part.images[0]}
            alt={part.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}
      
      {/* Content section */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-lg line-clamp-1">{part.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {part.make} {part.model} ({part.year})
        </p>
        
        {/* Show distance if available */}
        {showDistance && distanceText && (
          <div className="flex items-center gap-1 mb-2 text-sm text-primary">
            <MapPin className="h-4 w-4" />
            <span>{distanceText}</span>
          </div>
        )}
        
        {/* Price and condition */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline">{part.condition}</Badge>
          <span className="font-bold text-lg text-primary">{part.currency} {part.price}</span>
        </div>
        
        {/* Chat button */}
        <div className="mt-3">
          <ChatButton 
            partId={part.id} 
            sellerId={part.supplier_id} 
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default CarPartCardWithChat;
