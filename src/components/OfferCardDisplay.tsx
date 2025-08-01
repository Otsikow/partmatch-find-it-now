
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, MessageCircle, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import ChatButton from "@/components/chat/ChatButton";

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  contact_unlocked: boolean;
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    phone: string;
    location: string;
    owner_id: string;
  };
}

interface OfferCardDisplayProps {
  offer: Offer;
  onWhatsAppContact: (phone: string, request: Offer['request']) => void;
}

const OfferCardDisplay = ({ offer, onWhatsAppContact }: OfferCardDisplayProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {offer.request.car_make} {offer.request.car_model} {offer.request.car_year}
            </CardTitle>
            <p className="text-orange-600 font-semibold text-base sm:text-lg mt-1">
              Part: {offer.request.part_needed}
            </p>
            {offer.message && (
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                "{offer.message}"
              </p>
            )}
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-xl sm:text-2xl font-bold text-green-600">GHS {offer.price}</p>
            {getStatusBadge(offer.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{offer.request.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>Submitted: {formatDate(offer.created_at)}</span>
          </div>
          {(offer.contact_unlocked || offer.status === 'accepted') && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">Contact Unlocked</span>
            </div>
          )}
        </div>

        {offer.status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-medium mb-2">🎉 Congratulations! Your offer was accepted.</p>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Phone className="h-4 w-4" />
              <span>Customer phone: {offer.request.phone}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {(offer.status === 'accepted' || offer.contact_unlocked) && (
            <Button
              onClick={() => onWhatsAppContact(offer.request.phone, offer.request)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
          
          <ChatButton
            buyerId={offer.request.owner_id}
            offerId={offer.id}
            offerInfo={{
              price: offer.price,
              car_make: offer.request.car_make,
              car_model: offer.request.car_model,
              car_year: offer.request.car_year,
              part_needed: offer.request.part_needed,
              message: offer.message
            }}
            variant="outline"
            size="sm"
          >
            Chat with Buyer
          </ChatButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCardDisplay;
