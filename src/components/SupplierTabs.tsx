
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Star, Settings, CreditCard } from "lucide-react";
import EnhancedPostCarPartForm from "./EnhancedPostCarPartForm";
import MyPartsTab from "./MyPartsTab";
import OffersTab from "./OffersTab";
import RequestsTab from "./RequestsTab";
import SellerProfileManagement from "./SellerProfileManagement";
import SubscriptionManager from "./SubscriptionManager";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useMyPartsCount } from "@/hooks/useMyPartsCount";
import TabCountBadge from "./TabCountBadge";

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
  const [showPostForm, setShowPostForm] = useState(false);
  const { hasBusinessSubscription } = useSubscriptionStatus();
  const partsCount = useMyPartsCount();

  const handlePartPosted = () => {
    setShowPostForm(false);
    // You might want to call a refresh function here if available
  };

  const handleViewRequests = () => {
    onTabChange('requests');
  };

  if (showPostForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Post New Car Part</h2>
          <Button
            variant="outline"
            onClick={() => setShowPostForm(false)}
          >
            Back to Dashboard
          </Button>
        </div>
        <EnhancedPostCarPartForm 
          onPartPosted={handlePartPosted}
          hasBusinessSubscription={hasBusinessSubscription}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
        <Button
          onClick={() => setShowPostForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Part
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="my-parts" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Parts
            <TabCountBadge count={partsCount} />
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Offers
            <TabCountBadge count={offers.length} />
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Requests
            <TabCountBadge count={requests.length} />
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-parts" className="space-y-4">
          <MyPartsTab onRefresh={() => {}} />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <OffersTab 
            offers={offers}
            onWhatsAppContact={onWhatsAppContact}
            onViewRequests={handleViewRequests}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestsTab 
            requests={requests}
            onOfferSubmit={onOfferSubmit}
            onWhatsAppContact={onWhatsAppContact}
            isSubmittingOffer={isSubmittingOffer}
          />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionManager sellerId="current-user-id" />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <SellerProfileManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierTabs;
