
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Navigation, Expand, X } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <>
      <Card className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        {/* Image Section */}
        <div 
          className="relative aspect-video w-full overflow-hidden bg-gray-100"
          onClick={() => setIsExpanded(true)}
        >
          {part.images && part.images.length > 0 ? (
            <img 
              src={part.images[0]} 
              alt={part.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${part.images && part.images.length > 0 ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-100 text-gray-500`}>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl mb-2">📦</div>
              <p className="text-xs sm:text-sm font-medium">Image not available yet</p>
            </div>
          </div>
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getConditionColor(part.condition)} text-xs sm:text-sm font-semibold`}>
              {part.condition}
            </Badge>
          </div>
          
          {/* Expand Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white h-8 w-8 p-0">
              <Expand className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4" onClick={() => setIsExpanded(true)}>
          <div className="space-y-2 sm:space-y-3">
            {/* Title and Price */}
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-lg lg:text-xl line-clamp-2 leading-tight">
                {part.title}
              </h3>
              <p className="text-green-600 font-bold text-lg sm:text-xl lg:text-2xl">
                {formatPrice(part.price, part.currency)}
              </p>
            </div>

            {/* Vehicle Info */}
            <div className="text-gray-600 text-xs sm:text-sm">
              <p className="font-medium">{part.make} {part.model} ({part.year}) - {part.part_type}</p>
            </div>

            {/* Description Preview */}
            {part.description && (
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {part.description}
              </p>
            )}

            {/* Location and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
              {part.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{part.address}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{format(new Date(part.created_at), 'MMM dd')}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 pt-0 border-t" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium truncate">{supplierName}</span>
              {part.supplier?.is_verified && (
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              )}
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <ChatButton
                sellerId={part.supplier_id}
                partId={part.id}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              />
              {part.address && (
                <Button size="sm" variant="default" onClick={openDirections} className="flex-1 sm:flex-none text-xs sm:text-sm">
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Get Directions</span>
                  <span className="sm:hidden">Directions</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold pr-8">{part.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            {part.images && part.images.length > 0 ? (
              <div className="space-y-3">
                <img
                  src={part.images[0]}
                  alt={part.title}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg"
                />
                {part.images.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {part.images.slice(1, 5).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${part.title} ${index + 2}`}
                        className="w-full h-16 sm:h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          // Could implement image carousel here
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl sm:text-6xl mb-4">📦</div>
                  <p className="text-sm sm:text-base font-medium">No image available</p>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Vehicle Details</h4>
                  <div className="space-y-1 text-sm sm:text-base">
                    <p className="text-gray-600">{part.make} {part.model} ({part.year})</p>
                    <p className="text-gray-600">Part Type: {part.part_type}</p>
                  </div>
                </div>
                
                {part.address && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{part.address}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Price & Condition</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(part.price, part.currency)}
                  </p>
                  <Badge className={`${getConditionColor(part.condition)} text-sm`}>
                    {part.condition}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Seller</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base">{supplierName}</span>
                    {part.supplier?.is_verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Description */}
            {part.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {part.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <ChatButton
                sellerId={part.supplier_id}
                partId={part.id}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-sm sm:text-base"
              />
              {part.address && (
                <Button 
                  onClick={openDirections}
                  variant="outline"
                  className="flex-1 border-green-600 text-green-700 hover:bg-green-50 text-sm sm:text-base"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarPartCardWithChat;
