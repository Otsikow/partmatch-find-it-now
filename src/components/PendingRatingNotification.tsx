
import { useState } from "react";
import { Bell, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import RatingModal from "./RatingModal";
import { useTransactionRating } from "@/hooks/useTransactionRating";

const PendingRatingNotification = () => {
  const { pendingRatings, markAsRated } = useTransactionRating();
  const [selectedRating, setSelectedRating] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(true);

  if (!showNotification || pendingRatings.length === 0) {
    return null;
  }

  const handleRateNow = (rating: any) => {
    setSelectedRating(rating);
  };

  const handleRatingSubmitted = () => {
    if (selectedRating) {
      markAsRated(selectedRating.offer_id);
      setSelectedRating(null);
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="bg-blue-100 rounded-full p-2">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-1">
              Rate Your Recent Purchases
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              You have {pendingRatings.length} completed transaction{pendingRatings.length > 1 ? 's' : ''} 
              waiting for your review. Help other buyers by sharing your experience.
            </p>
            
            <div className="space-y-2">
              {pendingRatings.slice(0, 3).map((rating) => (
                <div key={rating.offer_id} className="flex items-center justify-between bg-white rounded p-2">
                  <span className="text-sm font-medium">
                    Rate {rating.seller_name}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleRateNow(rating)}
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    Rate Now
                  </Button>
                </div>
              ))}
            </div>
            
            {pendingRatings.length > 3 && (
              <p className="text-xs text-blue-700 mt-2">
                +{pendingRatings.length - 3} more transactions to rate
              </p>
            )}
          </div>
          
          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 text-blue-400 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {selectedRating && (
        <RatingModal
          isOpen={!!selectedRating}
          onClose={() => setSelectedRating(null)}
          offerId={selectedRating.offer_id}
          sellerId={selectedRating.seller_id}
          sellerName={selectedRating.seller_name}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </>
  );
};

export default PendingRatingNotification;
