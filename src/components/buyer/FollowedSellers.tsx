import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSellerFollows } from '@/hooks/useSellerFollows';
import VerifiedBadge from '@/components/VerifiedBadge';

const FollowedSellers = () => {
  const navigate = useNavigate();
  const { followedSellers, loading, unfollowSeller } = useSellerFollows();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Followed Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (followedSellers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Followed Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No followed sellers yet</p>
            <p className="text-sm text-gray-400">
              Follow your favorite sellers to keep track of their latest parts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Followed Sellers ({followedSellers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followedSellers.map((follow) => {
            const seller = follow.seller;
            if (!seller) return null;

            return (
              <div
                key={follow.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/seller/${seller.id}`)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={seller.profile_photo_url} 
                      alt={`${seller.first_name} ${seller.last_name}`} 
                    />
                    <AvatarFallback>
                      {seller.first_name?.[0]}{seller.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {seller.first_name} {seller.last_name}
                      </h3>
                      {seller.is_verified && <VerifiedBadge isVerified={seller.is_verified} />}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1">
                      {seller.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {seller.rating.toFixed(1)} ({seller.total_ratings})
                          </span>
                        </div>
                      )}
                      
                      {(seller.city || seller.country) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {[seller.city, seller.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Following since {new Date(follow.created_at).toLocaleDateString()}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      unfollowSeller(seller.id);
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 fill-current mr-1" />
                    Unfollow
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowedSellers;