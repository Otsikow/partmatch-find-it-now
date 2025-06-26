
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsTab from "@/components/RequestsTab";
import OffersTab from "@/components/OffersTab";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
}

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

interface SupplierTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  requests: Request[];
  offers: Offer[];
  onOfferSubmit: (requestId: string, price: number, message: string, location: string) => Promise<void>;
  onWhatsAppContact: (phone: string, request: Request | Offer['request']) => void;
  isSubmittingOffer: boolean;
}

const SupplierTabs = ({ 
  activeTab, 
  onTabChange, 
  requests, 
  offers, 
  onOfferSubmit, 
  onWhatsAppContact, 
  isSubmittingOffer 
}: SupplierTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="requests" className="text-sm sm:text-base">
          Customer Requests ({requests.length})
        </TabsTrigger>
        <TabsTrigger value="offers" className="text-sm sm:text-base">
          My Offers ({offers.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="mt-0">
        <RequestsTab
          requests={requests}
          onOfferSubmit={onOfferSubmit}
          onWhatsAppContact={onWhatsAppContact}
          isSubmittingOffer={isSubmittingOffer}
        />
      </TabsContent>

      <TabsContent value="offers" className="mt-0">
        <OffersTab
          offers={offers}
          onWhatsAppContact={onWhatsAppContact}
          onViewRequests={() => onTabChange('requests')}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SupplierTabs;
