
import { CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, User } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import SellerRatingDisplay from "./SellerRatingDisplay";
import { formatDate } from "@/utils/carPartUtils";

interface CarPartCardContentProps {
  part: CarPart;
  onExpand: () => void;
}

const CarPartCardContent = ({ part, onExpand }: CarPartCardContentProps) => {
  // Fix the seller name construction to handle the profiles structure properly
  const sellerName = part.profiles?.first_name && part.profiles?.last_name 
    ? `${part.profiles.first_name} ${part.profiles.last_name}`.trim()
    : part.profiles?.first_name || part.profiles?.last_name || 'Seller';
  
  const initials = sellerName === 'Seller' 
    ? 'S' 
    : sellerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();

  console.log('CarPartCardContent - sellerName:', sellerName, 'for part:', part.title);
  console.log('CarPartCardContent - profiles data:', part.profiles);

  return (
    <div onClick={onExpand}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {part.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base text-gray-600">
              {part.make} {part.model} ({part.year})
            </p>
            <div className="text-right">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                {part.currency} {part.price}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 sm:py-4">
        <div className="space-y-3 sm:space-y-4">
          {part.description && (
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
              {part.description}
            </p>
          )}
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src={part.profiles?.profile_photo_url} alt={sellerName} />
                <AvatarFallback className="text-xs sm:text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{sellerName}</span>
              <VerifiedSellerBadge isVerified={part.profiles?.is_verified || false} size="sm" />
            </div>
            
            <SellerRatingDisplay
              rating={part.profiles?.rating || 0}
              totalRatings={part.profiles?.total_ratings || 0}
              size="sm"
              showBadge={true}
            />
          </div>

          {part.address && (
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{part.address}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Listed {formatDate(part.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default CarPartCardContent;
