import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, MessageCircle, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Offer {
  id: string;
  request_id: string;
  supplier_id: string;
  price: number;
  message: string;
  status: string;
  created_at: string;
  photo_url?: string;
  request: {
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    currency: string;
  };
  supplier_profile: {
    first_name: string;
    last_name: string;
    rating: number;
    is_verified: boolean;
  };
}

const BuyerOffersTab = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['buyer-offers', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get all offers for the buyer's requests
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:part_requests!inner (
            car_make,
            car_model,
            car_year,
            part_needed,
            currency,
            owner_id
          ),
          supplier_profile:profiles!supplier_id (
            first_name,
            last_name,
            rating,
            is_verified
          )
        `)
        .eq('request.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching buyer offers:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          buyer_id: user?.id 
        })
        .eq('id', offerId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Offer accepted successfully!');
      queryClient.invalidateQueries({ queryKey: ['buyer-offers'] });
    },
    onError: (error) => {
      console.error('Error accepting offer:', error);
      toast.error('Failed to accept offer');
    }
  });

  const rejectOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Offer rejected');
      queryClient.invalidateQueries({ queryKey: ['buyer-offers'] });
    },
    onError: (error) => {
      console.error('Error rejecting offer:', error);
      toast.error('Failed to reject offer');
    }
  });

  const handleAcceptOffer = (offerId: string) => {
    acceptOfferMutation.mutate(offerId);
  };

  const handleRejectOffer = (offerId: string) => {
    rejectOfferMutation.mutate(offerId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {offers.map((offer: Offer) => (
        <Card key={offer.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Header with car info and status */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {offer.request.car_make} {offer.request.car_model} {offer.request.car_year}
                  </h3>
                  <p className="text-orange-600 font-medium text-base">
                    Part: {offer.request.part_needed}
                  </p>
                </div>
                <Badge 
                  variant={
                    offer.status === 'pending' ? 'default' :
                    offer.status === 'accepted' ? 'secondary' :
                    'destructive'
                  }
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </Badge>
              </div>

              {/* Seller info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {offer.supplier_profile.first_name} {offer.supplier_profile.last_name}
                    {offer.supplier_profile.is_verified && (
                      <span className="ml-2 text-blue-600 text-sm">✓ Verified</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rating: {offer.supplier_profile.rating?.toFixed(1) || 'No ratings yet'}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {offer.request.currency} {offer.price}
                </span>
              </div>

              {/* Message */}
              {offer.message && (
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="bg-blue-50 p-3 rounded-lg flex-1">
                    <p className="text-sm text-foreground">{offer.message}</p>
                  </div>
                </div>
              )}

              {/* Created date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(offer.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Action buttons */}
              {offer.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleAcceptOffer(offer.id)}
                    disabled={acceptOfferMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Offer
                  </Button>
                  <Button
                    onClick={() => handleRejectOffer(offer.id)}
                    disabled={rejectOfferMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Offer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {offers.length === 0 && (
        <Card className="p-12 text-center bg-gradient-to-br from-white/90 to-primary/5 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-3">No Offers Yet</h3>
          <p className="text-muted-foreground text-lg mb-6">
            You haven't received any offers on your requests yet
          </p>
          <Button onClick={() => window.location.href = '/request-part'}>
            Submit a New Request
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BuyerOffersTab;