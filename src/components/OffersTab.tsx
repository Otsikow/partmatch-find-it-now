
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
    owner_id: string;
  };
}

interface OffersTabProps {
  offers: Offer[];
  onWhatsAppContact: (phone: string, request: Offer['request']) => void;
  onViewRequests: () => void;
}

const OffersTab = ({ offers, onWhatsAppContact, onViewRequests }: OffersTabProps) => {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {offers.map(offer => (
        <OfferCardDisplay
          key={offer.id}
          offer={offer}
          onWhatsAppContact={onWhatsAppContact}
        />
      ))}

      {offers.length === 0 && (
        <Card className="p-6 sm:p-8 lg:p-12 text-center bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4 lg:mb-6" />
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">No offers yet</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
            Start making offers on customer requests to grow your business
          </p>
          <Button 
            onClick={onViewRequests}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground text-sm sm:text-base"
          >
            View Customer Requests
          </Button>
        </Card>
      )}
    </div>
  );
};

export default OffersTab;
