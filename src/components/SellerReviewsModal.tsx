import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  reviewer_id: string;
  seller_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  transaction_verified: boolean;
  offer_id: string | null;
  reviewer_profile?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface SellerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  totalReviews: number;
}

const SellerReviewsModal: React.FC<SellerReviewsModalProps> = ({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  sellerRating,
  totalReviews
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);

  useEffect(() => {
    if (isOpen && sellerId) {
      fetchReviews();
      checkUserRating();
    }
  }, [isOpen, sellerId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      console.log('=== DEBUG: Fetching reviews for seller ===');
      console.log('sellerId:', sellerId);
      console.log('sellerName:', sellerName);
      console.log('sellerRating:', sellerRating);
      console.log('totalReviews:', totalReviews);
      
      if (!sellerId) {
        console.error('No sellerId provided!');
        setReviews([]);
        return;
      }
      
      // Fetch reviews first
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(20);

      console.log('=== DEBUG: Supabase query result ===');
      console.log('Error:', error);
      console.log('Data:', reviewsData);
      console.log('Data length:', reviewsData?.length);

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Fetched reviews data:', reviewsData);

      if (reviewsData && reviewsData.length > 0) {
        // Fetch reviewer profiles separately
        const reviewerIds = reviewsData.map(review => review.reviewer_id);
        console.log('Fetching profiles for reviewer IDs:', reviewerIds);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', reviewerIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          console.log('Fetched profiles data:', profilesData);
        }

        // Combine data
        const formattedReviews = reviewsData.map(review => ({
          ...review,
          reviewer_profile: profilesData?.find(profile => profile.id === review.reviewer_id) || null
        }));
        
        console.log('Formatted reviews:', formattedReviews);
        setReviews(formattedReviews);
      } else {
        console.log('No reviews found for seller');
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRating = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('seller_id', sellerId)
        .maybeSingle();

      if (error) throw error;
      setUserHasRated(!!data);
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReviewerName = (review: Review) => {
    if (review.reviewer_profile?.first_name) {
      const firstName = review.reviewer_profile.first_name;
      const lastName = review.reviewer_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'Anonymous User';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="w-5 h-5" />
            Reviews for {sellerName}
          </DialogTitle>
        </DialogHeader>

        {/* Rating Summary */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{sellerRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 mt-1">
              {renderStars(Math.round(sellerRating))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
            {userHasRated && (
              <Badge variant="secondary" className="mt-1">
                You've already rated this seller
              </Badge>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {getReviewerName(review)}
                      </span>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                      {review.transaction_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    
                    {review.review_text && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reviews yet</p>
              <p className="text-sm text-gray-400">
                Be the first to review this seller after completing a transaction
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerReviewsModal;