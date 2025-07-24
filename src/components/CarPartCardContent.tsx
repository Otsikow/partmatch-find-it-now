
import { CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, User } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import SellerRatingDisplay from "./SellerRatingDisplay";
import { formatDate } from "@/utils/carPartUtils";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { getLocationDisplayText, isInSameCity, calculateDistance } from "@/utils/distanceUtils";

interface CarPartCardContentProps {
  part: CarPart;
  onExpand: () => void;
}

const CarPartCardContent = ({ part, onExpand }: CarPartCardContentProps) => {
  // Get user's location for distance calculation
  const { location: userLocation } = useLocationDetection({
    requestOnMount: false, // Don't auto-request on mount for privacy
    includeAddress: false
  });

  // Fix the seller name construction to handle the profiles structure properly
  const sellerName = part.profiles?.first_name && part.profiles?.last_name 
    ? `${part.profiles.first_name} ${part.profiles.last_name}`.trim()
    : part.profiles?.first_name || part.profiles?.last_name || 'Seller';
  
  const initials = sellerName === 'Seller' 
    ? 'S' 
    : sellerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();

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

  console.log('CarPartCardContent - sellerName:', sellerName, 'for part:', part.title);
  console.log('CarPartCardContent - profiles data:', part.profiles);

  return (
    <div onClick={onExpand} className="p-2 sm:p-3">
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-tight">
          {part.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {part.make} {part.model} ({part.year})
          </p>
          <div className="text-right">
            <p className="text-sm sm:text-base font-bold text-green-600">
              {part.currency} {part.price}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1 sm:space-y-2">
        {part.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {part.description}
          </p>
        )}

        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs text-foreground">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
              <AvatarImage src={part.profiles?.profile_photo_url} alt={sellerName} />
              <AvatarFallback className="text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium truncate">{sellerName}</span>
            <VerifiedSellerBadge isVerified={part.profiles?.is_verified || false} size="xs" />
          </div>
          
          <SellerRatingDisplay
            rating={part.profiles?.rating || 0}
            totalRatings={part.profiles?.total_ratings || 0}
            size="xs"
            showBadge={true}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className={`truncate ${inSameCity ? 'text-green-600 font-medium' : ''}`}>
            {locationDisplayText}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Listed {formatDate(part.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default CarPartCardContent;
