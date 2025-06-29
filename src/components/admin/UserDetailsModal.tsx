
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  FileText,
  Eye,
  CheckCircle,
  Ban,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  user_type: 'owner' | 'supplier' | 'admin';
  is_verified: boolean;
  is_blocked: boolean;  
  created_at: string;
  rating?: number;
  total_ratings?: number;
  email?: string;
}

interface Review {
  id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  reviewer: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface CarPart {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  created_at: string;
}

interface UserDetailsModalProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (userId: string) => void;
  onSuspend: (userId: string, reason: string) => void;
  onDelete: (userId: string, reason: string) => void;
  onUnblock: (userId: string) => void;
}

const UserDetailsModal = ({ 
  user, 
  open, 
  onOpenChange, 
  onApprove, 
  onSuspend, 
  onDelete, 
  onUnblock 
}: UserDetailsModalProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      fetchUserDetails();
    }
  }, [user, open]);

  const fetchUserDetails = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch reviews for this user (if they're a seller)
      if (user.user_type === 'supplier') {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          // Fetch reviewer profiles separately
          const reviewsWithProfiles = await Promise.all(
            (reviewsData || []).map(async (review) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', review.reviewer_id)
                .single();

              return {
                ...review,
                reviewer: {
                  first_name: profileData?.first_name,
                  last_name: profileData?.last_name,
                  email: undefined // We don't have easy access to email from profiles
                }
              };
            })
          );
          
          setReviews(reviewsWithProfiles);
        }

        // Fetch car parts listings
        const { data: partsData, error: partsError } = await supabase
          .from('car_parts')
          .select('*')
          .eq('supplier_id', user.id)
          .order('created_at', { ascending: false });

        if (partsError) {
          console.error('Error fetching car parts:', partsError);
        } else {
          setCarParts(partsData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to load user details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
  
  const getStatusColor = (isBlocked: boolean, isVerified: boolean) => {
    if (isBlocked) return 'bg-red-100 text-red-800 border-red-200';
    if (isVerified) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (isBlocked: boolean, isVerified: boolean) => {
    if (isBlocked) return 'Suspended';
    if (isVerified) return 'Verified';
    return 'Unverified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback>
                {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-playfair font-semibold">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(user.is_blocked, user.is_verified)} text-sm`}>
                  {getStatusText(user.is_blocked, user.is_verified)}
                </Badge>
                <Badge variant="outline">
                  {user.user_type === 'supplier' ? 'Seller' : user.user_type}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined: {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Rating (for sellers) */}
          {user.user_type === 'supplier' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Rating</h3>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold">
                  {user.rating ? user.rating.toFixed(1) : '0.0'}/5
                </span>
                <span className="text-gray-500">
                  ({user.total_ratings || 0} reviews)
                </span>
              </div>
            </div>
          )}

          {/* Car Parts Listings (for sellers) */}
          {user.user_type === 'supplier' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Car Parts Listings ({carParts.length})</h3>
              {carParts.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {carParts.map(part => (
                    <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{part.title}</h4>
                        <p className="text-sm text-gray-600">
                          {part.make} {part.model} {part.year} • GHS {part.price}
                        </p>
                      </div>
                      <Badge variant={part.status === 'available' ? 'default' : 'secondary'}>
                        {part.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No listings found</p>
              )}
            </div>
          )}

          {/* Reviews (for sellers) */}
          {user.user_type === 'supplier' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Reviews ({reviews.length})</h3>
              {reviews.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {reviews.map(review => (
                    <div key={review.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {review.reviewer.first_name} {review.reviewer.last_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      {review.review_text && (
                        <p className="text-sm text-gray-700">{review.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              )}
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!user.is_verified && !user.is_blocked && (
              <Button 
                onClick={() => onApprove(user.id)}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve User
              </Button>
            )}

            {user.is_blocked ? (
              <Button 
                onClick={() => onUnblock(user.id)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Unblock User
              </Button>
            ) : (
              <Button 
                onClick={() => onSuspend(user.id, 'Suspended by admin')}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend
              </Button>
            )}

            <Button 
              onClick={() => onDelete(user.id, 'Deleted by admin')}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
