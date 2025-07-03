
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
  owner_id: string;
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
  onChatContact: (requestId: string, ownerId: string) => void;
  isSubmittingOffer: boolean;
}

const SupplierTabs = ({ 
  activeTab, 
  onTabChange, 
  requests, 
  offers, 
  onOfferSubmit, 
  onWhatsAppContact, 
  onChatContact,
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
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
        <Button
          onClick={() => setShowPostForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Part
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 h-auto p-1 bg-muted">
          <TabsTrigger 
            value="my-parts" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-1 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Package className="h-4 w-4" />
            <span className="text-[10px] leading-tight">My Parts</span>
            <TabCountBadge count={partsCount} />
          </TabsTrigger>
          <TabsTrigger 
            value="offers" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-1 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Star className="h-4 w-4" />
            <span className="text-[10px] leading-tight">Offers</span>
            <TabCountBadge count={offers.length} />
          </TabsTrigger>
          <TabsTrigger 
            value="requests" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-1 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="text-[10px] leading-tight">Requests</span>
            <TabCountBadge count={requests.length} />
          </TabsTrigger>
          <TabsTrigger 
            value="subscription" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-1 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px] leading-tight">Sub</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-1 py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="text-[10px] leading-tight">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-parts" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-1">My Parts</h3>
            <p className="text-sm text-blue-700">All the car parts you have listed for sale as a supplier. Use this to manage, edit, or remove your own listings (your inventory).</p>
          </div>
          <MyPartsTab onRefresh={() => {}} />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-1">Offers</h3>
            <p className="text-sm text-green-700">All the offers you have made to buyers who requested parts. Use this to track your price quotes, check if a buyer has accepted, and follow up on deals.</p>
          </div>
          <OffersTab 
            offers={offers}
            onWhatsAppContact={onWhatsAppContact}
            onViewRequests={handleViewRequests}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-orange-900 mb-1">Requests</h3>
            <p className="text-sm text-orange-700">All the requests from buyers for parts (open market demand). Use this to see what buyers are looking for, and decide if you want to respond with an offer.</p>
          </div>
          <RequestsTab 
            requests={requests}
            onOfferSubmit={onOfferSubmit}
            onWhatsAppContact={onWhatsAppContact}
            onChatContact={onChatContact}
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
