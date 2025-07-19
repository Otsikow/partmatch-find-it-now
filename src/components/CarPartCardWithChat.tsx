
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Calendar, Navigation, Expand, X, Star, ChevronDown, ChevronUp } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import SellerRatingDisplay from "@/components/SellerRatingDisplay";
import SaveButton from "@/components/SaveButton";
import FollowSellerButton from "@/components/FollowSellerButton";
import RatingModal from "@/components/RatingModal";
import SellerReviewsModal from "@/components/SellerReviewsModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { getLocationDisplayText, isInSameCity, calculateDistance } from "@/utils/distanceUtils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ImageGallery from "./ImageGallery";

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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

  const formatPrice = (price: number, currency: string, country?: string) => {
    // If it's Ghana, force GHS currency regardless of what's stored
    if (country?.toLowerCase().includes('ghana')) {
      return `GHS ${price.toLocaleString()}`;
    }
    
    // Use proper currency symbols based on currency code
    switch (currency?.toUpperCase()) {
      case 'GHS':
        return `GHS ${price.toLocaleString()}`;
      case 'USD':
        return `$${price.toLocaleString()}`;
      case 'EUR':
        return `€${price.toLocaleString()}`;
      case 'GBP':
        return `£${price.toLocaleString()}`;
      case 'NGN':
        return `₦${price.toLocaleString()}`;
      default:
        return `${currency || 'GHS'} ${price.toLocaleString()}`;
    }
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

  const handleRateSellerClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowRatingModal(true);
  };

  const handleToggleCollapsible = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsibleOpen(!isCollapsibleOpen);
  };

  return (
    <>
      <Card className="w-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-card border-0 shadow-md">
        {/* Image Section */}
        <div 
          className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-lg"
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
          <div className={`${part.images && part.images.length > 0 ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-muted text-muted-foreground`}>
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
            <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background h-7 w-7 p-0">
              <Expand className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4 lg:p-5 bg-card" onClick={() => setIsExpanded(true)}>
          <div className="space-y-2 sm:space-y-3">
            {/* Title and Price */}
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg line-clamp-2 leading-tight text-card-foreground">
                {part.title}
              </h3>
              <p className="text-success font-bold text-base sm:text-lg lg:text-xl">
                {formatPrice(part.price, part.currency, (part as any).country)}
              </p>
            </div>

            {/* Vehicle Info */}
            <div className="text-muted-foreground text-xs sm:text-sm">
              <p className="font-medium line-clamp-1">{part.make} {part.model} ({part.year}) - {part.part_type}</p>
            </div>

            {/* Description Preview */}
            {part.description && (
              <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {part.description}
              </p>
            )}
          </div>
        </CardContent>

        <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
          {/* Collapsible trigger */}
          <div className="px-4 pb-2" onClick={(e) => e.stopPropagation()}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={handleToggleCollapsible}
              >
                {isCollapsibleOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Collapsible content - seller info, location, and action buttons */}
          <CollapsibleContent>
            <CardContent className="pt-0 pb-3 sm:pb-4 lg:pb-5 bg-card" onClick={() => setIsExpanded(true)}>
              <div className="space-y-2 sm:space-y-3">
                {/* Seller Info with Avatar */}
                {part.profiles && (
                  <div className="border-t border-border pt-2 sm:pt-3 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                        <AvatarImage src={part.profiles.profile_photo_url} alt={supplierName} />
                        <AvatarFallback className="text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm font-medium text-card-foreground line-clamp-1">{supplierName}</span>
                      {part.profiles.is_verified && (
                        <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 py-0">Verified</Badge>
                      )}
                    </div>
                    
                    <div 
                      className="cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReviewsModal(true);
                      }}
                    >
                      <SellerRatingDisplay
                        rating={part.profiles.rating || 0}
                        totalRatings={part.profiles.total_ratings || 0}
                        size="sm"
                        showBadge={true}
                      />
                    </div>
                  </div>
                )}

                {/* Location and Date */}
                <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className={`truncate ${inSameCity ? 'text-success font-medium' : ''}`}>
                      {locationDisplayText}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{format(new Date(part.created_at), 'MMM dd')}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Action Buttons */}
            <div className="p-3 sm:p-4 lg:p-5 pt-0 border-t border-border bg-muted/30 rounded-b-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2 sm:gap-3">
                {/* Primary action buttons row */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <ChatButton
                    sellerId={part.supplier_id}
                    partId={part.id}
                    size={isMobile ? "mobile-sm" : "sm"}
                    variant="outline"
                    className="w-full justify-center font-medium text-xs sm:text-sm px-1 sm:px-2"
                  />
                  <Button 
                    size={isMobile ? "mobile-sm" : "sm"}
                    variant="outline"
                    className="w-full justify-center font-medium text-xs sm:text-sm px-1 sm:px-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      if (part.profiles?.phone) {
                        window.open(`https://wa.me/${part.profiles.phone.replace(/\D/g, '')}`, '_blank');
                      }
                    }}
                  >
                    <span className="text-green-600">📱</span>
                    <span className="ml-1 truncate">WhatsApp</span>
                  </Button>
                  <SaveButton 
                    partId={part.id} 
                    size={isMobile ? "mobile-sm" : "sm"}
                    variant="outline"
                    className="w-full border-red-200 hover:bg-red-50 text-xs sm:text-sm px-1 sm:px-2"
                  />
                </div>
                
                {/* Secondary action buttons row */}
                <div className="grid grid-cols-2 gap-2">
                  {part.address && (
                    <Button 
                      size={isMobile ? "mobile-default" : "sm"}
                      variant="default" 
                      onClick={openDirections} 
                      className="w-full justify-center font-medium"
                    >
                      <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">Directions</span>
                    </Button>
                  )}
                  <FollowSellerButton 
                    sellerId={part.supplier_id}
                    size={isMobile ? "default" : "sm"}
                    variant="outline"
                    showText={true}
                    className="w-full"
                  />
                </div>
                
                {/* Rate seller button */}
                <Button 
                  size={isMobile ? "mobile-default" : "sm"}
                  variant="secondary" 
                  onClick={handleRateSellerClick}
                  className="w-full justify-center font-medium"
                >
                  {user ? 'Rate Seller' : 'Sign In to Rate'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
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
              <ImageGallery 
                images={part.images} 
                title={part.title}
                className="mb-6"
              />
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
                    {formatPrice(part.price, part.currency, (part as any).country)}
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
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 pt-4 border-t`}>
              <ChatButton
                sellerId={part.supplier_id}
                partId={part.id}
                size={isMobile ? "mobile-default" : "default"}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 justify-center"
              />
              <SaveButton 
                partId={part.id} 
                size={isMobile ? "mobile-default" : "default"}
                variant="outline"
                className="border-red-200 hover:bg-red-50"
                showText={true}
              />
              <FollowSellerButton 
                sellerId={part.supplier_id}
                size="default"
                variant="outline"
                showText={true}
                className="flex-1"
              />
              {part.address && (
                <Button 
                  onClick={openDirections}
                  variant="outline"
                  size={isMobile ? "mobile-default" : "default"}
                  className="flex-1 border-green-600 text-green-700 hover:bg-green-50 justify-center"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              )}
            </div>
            
            {/* Rating Button - Only for authenticated users */}
            <div className="pt-3 border-t">
              <Button 
                onClick={handleRateSellerClick}
                variant="secondary"
                size={isMobile ? "mobile-default" : "default"}
                className="w-full justify-center"
              >
                {user ? 'Rate Seller' : 'Sign In to Rate'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal - Only show when user is authenticated */}
      {user && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          offerId={null} // No offer ID for direct seller ratings
          sellerId={part.supplier_id}
          sellerName={supplierName}
          onRatingSubmitted={() => {
            setShowRatingModal(false);
            // Could refresh seller rating here
          }}
        />
      )}

      {/* Seller Reviews Modal */}
      {part.profiles && (
        <SellerReviewsModal
          isOpen={showReviewsModal}
          onClose={() => setShowReviewsModal(false)}
          sellerId={part.supplier_id}
          sellerName={supplierName}
          sellerRating={part.profiles.rating || 0}
          totalReviews={part.profiles.total_ratings || 0}
        />
      )}
    </>
  );
};

export default CarPartCardWithChat;
