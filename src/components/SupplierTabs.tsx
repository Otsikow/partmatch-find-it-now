
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import RequestsTab from "@/components/RequestsTab";
import OffersTab from "@/components/OffersTab";
import MyPartsTab from "@/components/MyPartsTab";
import PostPartModal from "@/components/PostPartModal";

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
  const [isPostPartModalOpen, setIsPostPartModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePartPosted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="requests" className="text-xs sm:text-sm">
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-xs sm:text-sm">
              My Offers ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="parts" className="text-xs sm:text-sm">
              My Parts
            </TabsTrigger>
          </TabsList>

          <Button 
            onClick={() => setIsPostPartModalOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Post New Part
          </Button>
        </div>

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

        <TabsContent value="parts" className="mt-0">
          <MyPartsTab key={refreshKey} onRefresh={handlePartPosted} />
        </TabsContent>
      </Tabs>

      <PostPartModal
        isOpen={isPostPartModalOpen}
        onClose={() => setIsPostPartModalOpen(false)}
        onPartPosted={handlePartPosted}
      />
    </>
  );
};

export default SupplierTabs;
