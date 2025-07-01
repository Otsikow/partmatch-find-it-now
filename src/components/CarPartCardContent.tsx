
import { CardHeader, CardContent } from "@/components/ui/card";
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
  // Get seller name from profiles data
  const sellerName = part.profiles?.business_name || 
    `${part.profiles?.first_name || ''} ${part.profiles?.last_name || ''}`.trim() || 
    'Seller';

  return (
    <div onClick={onExpand}>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
            {part.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {part.make} {part.model} ({part.year})
            </p>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                {part.currency} {part.price}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-3">
          {part.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {part.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
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

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{part.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Listed {formatDate(part.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default CarPartCardContent;
