import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Star, Settings, CreditCard } from "lucide-react";
import PostCarPartForm from "./PostCarPartForm";
import MyPartsTab from "./MyPartsTab";
import OffersTab from "./OffersTab";
import RequestsTab from "./RequestsTab";
import SellerProfileManagement from "./SellerProfileManagement";
import SubscriptionManager from "./SubscriptionManager";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { CarPart } from "@/types/CarPart";
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
    owner_id: string;
  };
}
interface SupplierTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  requests: Request[];
  offers: Offer[];
  myParts: CarPart[];
  onOfferSubmit: (requestId: string, price: number, message: string, location: string) => Promise<void>;
  onWhatsAppContact: (phone: string, request: Request | Offer['request']) => void;
  onChatContact: (requestId: string, ownerId: string) => void;
  isSubmittingOffer: boolean;
  onRefreshParts: () => void;
}
const SupplierTabs = ({
  activeTab,
  onTabChange,
  requests,
  offers,
  myParts,
  onOfferSubmit,
  onWhatsAppContact,
  onChatContact,
  isSubmittingOffer,
  onRefreshParts
}: SupplierTabsProps) => {
  const [showPostForm, setShowPostForm] = useState(() => {
    // Persist the post form state in sessionStorage
    return sessionStorage.getItem('showPostForm') === 'true';
  });
  const {
    hasBusinessSubscription
  } = useSubscriptionStatus();

  const handlePartPosted = () => {
    setShowPostForm(false);
    sessionStorage.removeItem('showPostForm');
    // Refresh parts data after posting
    onRefreshParts();
  };
  const handleViewRequests = () => {
    onTabChange('requests');
  };
  if (showPostForm) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Post New Car Part</h2>
          <Button variant="outline" onClick={() => {
            setShowPostForm(false);
            sessionStorage.removeItem('showPostForm');
          }}>
            Back to Dashboard
          </Button>
        </div>
        <PostCarPartForm onPartPosted={handlePartPosted} />
      </div>;
  }
  return <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        <Button onClick={() => {
          setShowPostForm(true);
          sessionStorage.setItem('showPostForm', 'true');
        }} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-sm sm:text-base px-4 py-2 h-auto">
          <Plus className="h-4 w-4 mr-2" />
          Post New Part
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-0.5 sm:gap-1 h-auto p-1 bg-muted/50">
          <TabsTrigger value="my-parts" className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-xs px-1 py-1.5 sm:py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] leading-tight">My Parts</span>
            <TabCountBadge count={myParts.length} />
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-xs px-1 py-1.5 sm:py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] leading-tight">Offers</span>
            <TabCountBadge count={offers.length} />
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-xs px-1 py-1.5 sm:py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] leading-tight">Requests</span>
            <TabCountBadge count={requests.length} />
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-xs px-1 py-1.5 sm:py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground">
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] leading-tight">Sub</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-xs px-1 py-1.5 sm:py-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] leading-tight">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-parts" className="space-y-3 sm:space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm sm:text-base">My Parts</h3>
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">All the car parts you have listed for sale as a supplier. Use this to manage, edit, or remove your own listings (your inventory).</p>
          </div>
          <MyPartsTab parts={myParts} onRefresh={onRefreshParts} />
        </TabsContent>

        <TabsContent value="offers" className="space-y-3 sm:space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1 text-sm sm:text-base">Offers</h3>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">All the offers you have made to buyers who requested parts. Use this to track your price quotes, check if a buyer has accepted, and follow up on deals.</p>
          </div>
          <OffersTab offers={offers} onWhatsAppContact={onWhatsAppContact} onViewRequests={handleViewRequests} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-3 sm:space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1 text-sm sm:text-base">Requests</h3>
            <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">All the requests from buyers for parts (open market demand). Use this to see what buyers are looking for, and decide if you want to respond with an offer.</p>
          </div>
          <RequestsTab requests={requests} onOfferSubmit={onOfferSubmit} onWhatsAppContact={onWhatsAppContact} onChatContact={onChatContact} isSubmittingOffer={isSubmittingOffer} />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-3 sm:space-y-4">
          <SubscriptionManager sellerId="current-user-id" />
        </TabsContent>

        <TabsContent value="profile" className="space-y-3 sm:space-y-4">
          <SellerProfileManagement />
        </TabsContent>
      </Tabs>
    </div>;
};
export default SupplierTabs;

// Note: This file has grown quite large (200+ lines). Consider refactoring into smaller components:
// - SupplierTabsList component for the tab navigation
// - Individual tab content components (MyPartsContent, OffersContent, etc.)
// - This would improve maintainability and readability