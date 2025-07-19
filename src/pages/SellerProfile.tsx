import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Package, ArrowLeft, Calendar } from 'lucide-react';
import CarPartCardWithChat from '@/components/CarPartCardWithChat';
import FollowSellerButton from '@/components/FollowSellerButton';
import VerifiedBadge from '@/components/VerifiedBadge';
import { toast } from '@/hooks/use-toast';

interface SellerProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url?: string;
  is_verified: boolean;
  rating: number;
  total_ratings: number;
  city?: string;
  country?: string;
  created_at: string;
}

interface CarPart {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  part_type: string;
  condition: string;
  price: number;
  currency: string;
  description?: string;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  supplier_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
    rating?: number;
    total_ratings?: number;
    profile_photo_url?: string;
  };
}

const SellerProfile = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [partsLoading, setPartsLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      navigate('/');
      return;
    }
    fetchSellerProfile();
    fetchSellerParts();
  }, [sellerId, navigate]);

  const fetchSellerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      setSeller(data);
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load seller profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerParts = async () => {
    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select(`
          *,
          profiles(
            first_name,
            last_name,
            phone,
            is_verified,
            rating,
            total_ratings,
            profile_photo_url
          )
        `)
        .eq('supplier_id', sellerId)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching seller parts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load seller parts',
        variant: 'destructive',
      });
    } finally {
      setPartsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Seller not found</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sellerName = `${seller.first_name} ${seller.last_name}`.trim() || 'Seller';
  const initials = sellerName === 'Seller' 
    ? 'S' 
    : sellerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary-foreground text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Try to go back, fallback to home if no history
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="p-2 hover:bg-white/20 rounded-full text-white hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Seller Profile</h1>
              <p className="text-white/90">View all parts from this seller</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Seller Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={seller.profile_photo_url} alt={sellerName} />
                  <AvatarFallback className="text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{sellerName}</CardTitle>
                    {seller.is_verified && <VerifiedBadge isVerified={seller.is_verified} />}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    {seller.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {seller.rating.toFixed(1)} ({seller.total_ratings} reviews)
                        </span>
                      </div>
                    )}
                    
                    {(seller.city || seller.country) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {[seller.city, seller.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Seller since {new Date(seller.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <FollowSellerButton 
                sellerId={seller.id}
                variant="default"
                size="default"
                showText={true}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Parts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parts for Sale ({parts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : parts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No parts available</p>
                <p className="text-sm text-gray-400">
                  This seller doesn't have any parts listed at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parts.map((part) => (
                  <CarPartCardWithChat key={part.id} part={part} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProfile;