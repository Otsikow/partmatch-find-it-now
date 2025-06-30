
import { useState } from "react";
import { Bell, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RatingModal from "./RatingModal";
import { useTransactionRating } from "@/hooks/useTransactionRating";

const PendingRatingNotification = () => {
  const { pendingRatings, loading, markAsRated } = useTransactionRating();
  const [selectedRating, setSelectedRating] = useState<{
    offerId: string;
    sellerId: string;
    sellerName: string;
  } | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (loading || pendingRatings.length === 0) {
    return null;
  }

  const displayedRatings = showAll ? pendingRatings : pendingRatings.slice(0, 2);

  return (
    <>
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-yellow-800">
                  Rate your recent purchases
                </h3>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                  {pendingRatings.length}
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Help other buyers by rating your recent transactions
              </p>
              
              <div className="space-y-2">
                {displayedRatings.map((transaction) => (
                  <div
                    key={transaction.offer_id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-sm">{transaction.seller_name}</p>
                      <p className="text-xs text-gray-500">
                        Transaction completed
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedRating({
                        offerId: transaction.offer_id,
                        sellerId: transaction.seller_id,
                        sellerName: transaction.seller_name
                      })}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Rate
                    </Button>
                  </div>
                ))}
              </div>
              
              {pendingRatings.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="mt-2 text-yellow-700 hover:text-yellow-800"
                >
                  {showAll ? 'Show less' : `Show ${pendingRatings.length - 2} more`}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRating && (
        <RatingModal
          isOpen={!!selectedRating}
          onClose={() => setSelectedRating(null)}
          offerId={selectedRating.offerId}
          sellerId={selectedRating.sellerId}
          sellerName={selectedRating.sellerName}
          onRatingSubmitted={() => {
            markAsRated(selectedRating.offerId);
            setSelectedRating(null);
          }}
        />
      )}
    </>
  );
};

export default PendingRatingNotification;
