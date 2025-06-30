
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  sellerId: string;
  sellerName: string;
  onRatingSubmitted: () => void;
}

const RatingModal = ({ 
  isOpen, 
  onClose, 
  offerId, 
  sellerId, 
  sellerName,
  onRatingSubmitted 
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting rating:', { offerId, sellerId, rating, reviewText });

      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          seller_id: sellerId,
          offer_id: offerId,
          rating: rating,
          review_text: reviewText.trim() || null,
          transaction_verified: true
        });

      if (error) {
        console.error('Error submitting rating:', error);
        throw error;
      }

      console.log('Rating submitted successfully');

      toast({
        title: "Rating Submitted!",
        description: "Thank you for rating this seller.",
      });

      onRatingSubmitted();
      onClose();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              How was your experience with <span className="font-semibold">{sellerName}</span>?
            </p>
            
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {rating > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with other buyers..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitRating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
