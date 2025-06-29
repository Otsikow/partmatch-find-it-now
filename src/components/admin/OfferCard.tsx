
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

interface Offer {
  id: string;
  requestId: string;
  supplier: string;
  price: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

interface Request {
  id: string;
  make: string;
  model: string;
  part: string;
}

interface OfferCardProps {
  offer: Offer;
  relatedRequest?: Request;
  onAcceptOffer: (requestId: string, offerId: string) => void;
}

const OfferCard = ({ offer, relatedRequest, onAcceptOffer }: OfferCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h3 className="font-playfair font-semibold text-lg sm:text-xl">
            {relatedRequest?.make} {relatedRequest?.model} - {relatedRequest?.part}
          </h3>
          <p className="text-gray-600 font-crimson text-base sm:text-lg">Supplier: {offer.supplier}</p>
          <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            {offer.price}
          </p>
        </div>
        <Badge className={`${getStatusColor(offer.status)} text-sm sm:text-base`}>
          {offer.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          {offer.phone}
        </div>
      </div>

      {offer.status === 'pending' && (
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => onAcceptOffer(offer.requestId, offer.id)}
          >
            Accept Offer
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(`tel:${offer.phone}`, '_self')}
            className="text-base border-purple-200 hover:bg-purple-50"
          >
            Call Supplier
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OfferCard;
