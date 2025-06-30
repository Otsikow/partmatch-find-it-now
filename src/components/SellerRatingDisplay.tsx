
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SellerRatingDisplayProps {
  rating?: number;
  totalRatings?: number;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SellerRatingDisplay = ({ 
  rating = 0, 
  totalRatings = 0, 
  showBadge = false,
  size = 'md'
}: SellerRatingDisplayProps) => {
  const starSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  if (totalRatings === 0) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`${starSize} text-gray-300`} />
          ))}
        </div>
        <span className={`${textSize} text-gray-500`}>No ratings</span>
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${starSize} ${
                star <= fullStars
                  ? 'text-yellow-400 fill-yellow-400'
                  : star === fullStars + 1 && hasHalfStar
                  ? 'text-yellow-400 fill-yellow-400 opacity-50'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`${textSize} font-medium`}>
          {rating.toFixed(1)}
        </span>
        <span className={`${textSize} text-gray-500`}>
          ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
        </span>
      </div>
      
      {showBadge && rating >= 4.5 && totalRatings >= 5 && (
        <Badge variant="secondary" className="text-xs">
          Top Rated
        </Badge>
      )}
    </div>
  );
};

export default SellerRatingDisplay;
