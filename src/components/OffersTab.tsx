
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import OfferCardDisplay from "@/components/OfferCardDisplay";

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
  };
}

interface OffersTabProps {
  offers: Offer[];
  onWhatsAppContact: (phone: string, request: Offer['request']) => void;
  onViewRequests: () => void;
}

const OffersTab = ({ offers, onWhatsAppContact, onViewRequests }: OffersTabProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {offers.map(offer => (
        <OfferCardDisplay
          key={offer.id}
          offer={offer}
          onWhatsAppContact={onWhatsAppContact}
        />
      ))}

      {offers.length === 0 && (
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No offers yet</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
            Start making offers on customer requests to grow your business
          </p>
          <Button 
            onClick={onViewRequests}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
          >
            View Customer Requests
          </Button>
        </Card>
      )}
    </div>
  );
};

export default OffersTab;
