
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

  const handleAcceptOffer = () => {
    console.log('Accept offer clicked for:', offer.id, 'request:', offer.requestId);
    onAcceptOffer(offer.requestId, offer.id);
  };

  return (
    <Card className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair font-semibold text-base sm:text-lg lg:text-xl truncate">
            {relatedRequest?.make} {relatedRequest?.model} - {relatedRequest?.part}
          </h3>
          <p className="text-gray-600 font-crimson text-sm sm:text-base lg:text-lg truncate">
            Supplier: {offer.supplier}
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            {offer.price}
          </p>
        </div>
        <Badge className={`${getStatusColor(offer.status)} text-xs sm:text-sm lg:text-base shrink-0`}>
          {offer.status}
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 font-crimson">
        <div className="flex items-center gap-1 min-w-0">
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate">{offer.phone}</span>
        </div>
      </div>

      {offer.status === 'pending' && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
            onClick={handleAcceptOffer}
          >
            Accept Offer
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(`tel:${offer.phone}`, '_self')}
            className="text-sm sm:text-base border-purple-200 hover:bg-purple-50 flex-1 sm:flex-none"
          >
            Call Supplier
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OfferCard;
