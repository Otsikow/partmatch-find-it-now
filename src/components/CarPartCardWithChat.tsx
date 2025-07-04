
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Calendar, Navigation, Expand, X } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import SellerRatingDisplay from "@/components/SellerRatingDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { getLocationDisplayText, isInSameCity, calculateDistance } from "@/utils/distanceUtils";

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
}

const CarPartCardWithChat = ({ part }: CarPartCardWithChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get user's location for distance calculation
  const { location: userLocation } = useLocationDetection({
    requestOnMount: false, // Don't auto-request on mount for privacy
    includeAddress: false
  });

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

  const supplierName = part.profiles 
    ? `${part.profiles.first_name || ''} ${part.profiles.last_name || ''}`.trim() || 'Seller'
    : 'Seller';

  const initials = supplierName === 'Seller' 
    ? 'S' 
    : supplierName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();

  // Calculate distance and location display text
  const locationDisplayText = getLocationDisplayText(
    userLocation?.latitude,
    userLocation?.longitude,
    part.latitude,
    part.longitude,
    part.address
  );

  // Check if this part is in the same city for styling
  const inSameCity = userLocation?.latitude && userLocation?.longitude && 
    part.latitude && part.longitude &&
    isInSameCity(calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      part.latitude, 
      part.longitude
    ));

  const openDirections = () => {
    if (part.address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(part.address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white border-0 shadow-md">
        {/* Image Section */}
        <div 
          className="relative aspect-video w-full overflow-hidden bg-gray-100 rounded-t-lg"
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
            <div className="text-center p-3 sm:p-4">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📦</div>
              <p className="text-xs font-medium">Image not available yet</p>
            </div>
          </div>
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getConditionColor(part.condition)} text-xs font-semibold px-2 py-1`}>
              {part.condition}
            </Badge>
          </div>
          
          {/* Expand Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white h-7 w-7 p-0">
              <Expand className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 sm:p-5 lg:p-6" onClick={() => setIsExpanded(true)}>
          <div className="space-y-3 sm:space-y-4">
            {/* Title and Price */}
            <div className="space-y-2">
              <h3 className="font-bold text-base sm:text-lg lg:text-xl line-clamp-2 leading-tight text-gray-900">
                {part.title}
              </h3>
              <p className="text-green-600 font-bold text-lg sm:text-xl lg:text-2xl">
                {formatPrice(part.price, part.currency)}
              </p>
            </div>

            {/* Vehicle Info */}
            <div className="text-gray-600 text-sm sm:text-base">
              <p className="font-medium">{part.make} {part.model} ({part.year}) - {part.part_type}</p>
            </div>

            {/* Description Preview */}
            {part.description && (
              <p className="text-gray-600 text-sm sm:text-base line-clamp-2 leading-relaxed">
                {part.description}
              </p>
            )}

            {/* Seller Info with Avatar */}
            {part.profiles && (
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={part.profiles.profile_photo_url} alt={supplierName} />
                    <AvatarFallback className="text-xs sm:text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm sm:text-base font-medium">{supplierName}</span>
                  {part.profiles.is_verified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>
                
                <SellerRatingDisplay
                  rating={part.profiles.rating || 0}
                  totalRatings={part.profiles.total_ratings || 0}
                  size="sm"
                  showBadge={true}
                />
              </div>
            )}

            {/* Location and Date */}
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className={`truncate ${inSameCity ? 'text-green-600 font-medium' : ''}`}>
                  {locationDisplayText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{format(new Date(part.created_at), 'MMM dd')}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 lg:p-6 pt-0 border-t bg-gray-50/50 rounded-b-lg" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 sm:gap-3">
            <ChatButton
              sellerId={part.supplier_id}
              partId={part.id}
              size="sm"
              variant="outline"
              className="flex-1 text-sm h-9 sm:h-10 font-medium"
            />
            {part.address && (
              <Button 
                size="sm" 
                variant="default" 
                onClick={openDirections} 
                className="flex-1 text-sm h-9 sm:h-10 font-medium"
              >
                <Navigation className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Get Directions</span>
                <span className="sm:hidden">Directions</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold pr-8">{part.title}</DialogTitle>
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
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className={`${inSameCity ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        {locationDisplayText}
                      </span>
                    </div>
                    {part.address && locationDisplayText !== part.address && (
                      <p className="text-xs text-gray-500 ml-6">{part.address}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Price & Condition</h4>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(part.price, part.currency)}
                  </p>
                  <Badge className={`${getConditionColor(part.condition)} text-sm`}>
                    {part.condition}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Seller</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={part.profiles?.profile_photo_url} alt={supplierName} />
                        <AvatarFallback className="text-sm font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm sm:text-base font-medium">{supplierName}</span>
                      {part.profiles?.is_verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    {/* Seller Rating in Expanded View */}
                    <SellerRatingDisplay
                      rating={part.profiles?.rating || 0}
                      totalRatings={part.profiles?.total_ratings || 0}
                      size="md"
                      showBadge={true}
                    />
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
