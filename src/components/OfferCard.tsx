import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Package, MapPin, Star } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";
import RatingModal from "./RatingModal";
import { format, formatDistanceToNow } from 'date-fns';

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  transaction_completed?: boolean;
  supplier?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    location?: string;
    is_verified?: boolean;
  };
  request?: {
    part_needed: string;
    car_make: string;
    car_model: string;
    car_year: number;
    description?: string;
  };
}

interface OfferCardProps {
  offer: Offer;
  onContactUnlock?: (offerId: string) => void;
  showActions?: boolean;
  currentUserId?: string;
}

const OfferCard = ({ offer, onContactUnlock, showActions = true, currentUserId }: OfferCardProps) => {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': 
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const supplierName = offer.supplier 
    ? `${offer.supplier.first_name || ''} ${offer.supplier.last_name || ''}`.trim() || 'Supplier'
    : 'Supplier';

  const canShowChat = offer.supplier?.id && currentUserId && offer.supplier.id !== currentUserId;
  const canRate = offer.transaction_completed && offer.supplier?.id;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">
              Offer from {supplierName}
            </CardTitle>
            <Badge className={`${getStatusColor(offer.status)} border`}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Request Details */}
          {offer.request && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Package className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">
                    {offer.request.part_needed}
                  </p>
                  <p className="text-xs text-gray-600">
                    {offer.request.car_make} {offer.request.car_model} ({offer.request.car_year})
                  </p>
                </div>
              </div>
              {offer.request.description && (
                <p className="text-xs text-gray-600 mt-2">
                  {offer.request.description}
                </p>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="font-bold text-xl text-green-600">
              GHS {offer.price.toLocaleString()}
            </span>
          </div>

          {/* Offer Message */}
          {offer.message && (
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-gray-700">{offer.message}</p>
            </div>
          )}

          {/* Supplier Info */}
          {offer.supplier && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-sm">{supplierName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {offer.supplier.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{offer.supplier.location}</span>
                      </>
                    )}
                    {offer.supplier.is_verified && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-3 border-t">
              {canShowChat && (
                <ChatButton
                  sellerId={offer.supplier!.id!}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-purple-600 text-purple-700 hover:bg-purple-50"
                />
              )}
              
              {canRate && (
                <Button
                  size="sm"
                  onClick={() => setShowRatingModal(true)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Rate Seller
                </Button>
              )}
              
              {onContactUnlock && offer.supplier?.phone && (
                <Button
                  size="sm"
                  onClick={() => onContactUnlock(offer.id)}
                  className="flex-1"
                >
                  Unlock Contact
                </Button>
              )}
              
              {offer.supplier?.phone && !onContactUnlock && (
                <Button
                  size="sm"
                  onClick={() => window.open(`tel:${offer.supplier!.phone}`, '_self')}
                  className="flex-1"
                >
                  Call Now
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Modal */}
      {showRatingModal && offer.supplier?.id && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          offerId={offer.id}
          sellerId={offer.supplier.id}
          sellerName={supplierName}
          onRatingSubmitted={() => {
            setShowRatingModal(false);
            // Optionally refresh data or show success message
          }}
        />
      )}
    </>
  );
};

export default OfferCard;
