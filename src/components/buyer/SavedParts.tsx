
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ChatButton from '@/components/chat/ChatButton';

const SavedParts = () => {
  const { user } = useAuth();

  const { data: savedParts = [], isLoading, refetch } = useQuery({
    queryKey: ['saved-parts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('saved_parts')
        .select(`
          id,
          created_at,
          list_name,
          notes,
          part_id,
          car_parts (
            id,
            title,
            make,
            model,
            year,
            price,
            currency,
            condition,
            city,
            country,
            address,
            images,
            supplier_id,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved parts:', error);
        return [];
      }

      return data?.filter(item => item.car_parts) || [];
    },
    enabled: !!user?.id,
  });

  const removeSavedPart = async (savedPartId: string) => {
    try {
      const { error } = await supabase
        .from('saved_parts')
        .delete()
        .eq('id', savedPartId);

      if (error) throw error;

      toast({
        title: "Part Removed",
        description: "The part has been removed from your saved list.",
      });

      refetch();
    } catch (error) {
      console.error('Error removing saved part:', error);
      toast({
        title: "Error",
        description: "Failed to remove the part. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number, currency: string, country: string) => {
    // If it's Ghana, force GHS currency
    if (country?.toLowerCase().includes('ghana')) {
      return `GHS ${price.toFixed(2)}`;
    }
    
    // Use the stored currency
    switch (currency?.toUpperCase()) {
      case 'GHS':
        return `GHS ${price.toFixed(2)}`;
      case 'USD':
        return `$${price.toFixed(2)}`;
      case 'EUR':
        return `€${price.toFixed(2)}`;
      case 'GBP':
        return `£${price.toFixed(2)}`;
      default:
        return `${currency || 'GHS'} ${price.toFixed(2)}`;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-yellow-100 text-yellow-800';
      case 'refurbished':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLocation = (city: string, country: string, address: string) => {
    if (city && country) {
      return `${city}, ${country}`;
    }
    if (address) {
      return address;
    }
    return 'Location not specified';
  };

  const getSellerName = (profiles: any) => {
    if (profiles?.first_name || profiles?.last_name) {
      return `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim();
    }
    return 'Seller';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved parts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Saved parts</h2>
        <p className="text-sm text-gray-600">{savedParts.length} saved items</p>
      </div>

      {savedParts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved parts</h3>
            <p className="text-gray-600 mb-4">Save parts you're interested in to view them later.</p>
            <Button onClick={() => window.location.href = '/search-parts'}>Browse parts</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedParts.map((savedItem: any) => {
            const part = savedItem.car_parts;
            if (!part) return null;
            
            return (
              <Card key={savedItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {part.title}
                  </CardTitle>
                  <Badge className={getConditionColor(part.condition)}>
                    {part.condition}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {part.make} {part.model} {part.year}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    {/* <DollarSign className="h-4 w-4 text-gray-400" /> */}
                    <span className="text-sm font-medium">
                      {formatPrice(part.price, part.currency, part.country)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatLocation(part.city, part.country, part.address)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Saved: {new Date(savedItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Seller: {getSellerName(part.profiles)}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeSavedPart(savedItem.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <ChatButton
                      sellerId={part.supplier_id}
                      partId={part.id}
                      size="sm"
                    >
                      Contact seller
                    </ChatButton>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedParts;
