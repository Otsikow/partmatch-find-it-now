import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageCircle, Search, Star, BarChart3, Users, ShoppingCart } from "lucide-react";
import MyOrders from "@/components/buyer/MyOrders";
import SavedParts from "@/components/buyer/SavedParts";
import SellCarPartsTab from "@/components/SellCarPartsTab";
import MyPartsTab from "@/components/MyPartsTab";
import OffersTab from "@/components/OffersTab";
import RequestsTab from "@/components/RequestsTab";
import Chat from "@/pages/Chat";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useOfferHandling } from "@/hooks/useOfferHandling";

interface UserProfile {
  user_type: string;
  first_name?: string;
  last_name?: string;
}

const HomeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Supplier data hooks
  const { requests, myOffers, loading: supplierLoading, refetch } = useSupplierData();
  const { handleMakeOffer, handleWhatsAppContact, isSubmittingOffer } = useOfferHandling(refetch);

  const handleChatContact = (requestId: string, ownerId: string) => {
    // Navigate to chat page with the buyer
    navigate('/chat', { state: { requestId, buyerId: ownerId } });
  };
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userType = profile?.user_type || 'owner';
  const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'User';

  const buyerTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'saved', label: 'Saved Parts', icon: Star },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const sellerTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sell', label: 'Sell Parts', icon: Package },
    { id: 'my-parts', label: 'My Parts', icon: Package },
    { id: 'offers', label: 'Offers', icon: Users },
    { id: 'requests', label: 'Requests', icon: Search },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const tabs = userType === 'supplier' ? sellerTabs : buyerTabs;

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName || 'User'}!
          </h2>
          <p className="text-gray-600">
            {userType === 'supplier' 
              ? 'Manage your car parts listings and track your sales.'
              : 'Find the perfect car parts for your vehicle.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {userType === 'supplier' ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Parts Listed</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Parts available for sale
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Pending buyer responses
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">GHS 0</div>
                  <p className="text-xs text-muted-foreground">
                    This month's earnings
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Parts you've ordered
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Parts</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Parts in your wishlist
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Unread conversations
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return <MyOrders />;
      case 'saved':
        return <SavedParts />;
      case 'sell':
        return <SellCarPartsTab />;
      case 'my-parts':
        return <MyPartsTab onRefresh={refetch} />;
      case 'offers':
        return <OffersTab 
          offers={myOffers} 
          onWhatsAppContact={handleWhatsAppContact}
          onViewRequests={() => setActiveTab('requests')}
        />;
      case 'requests':
        return <RequestsTab 
          requests={requests}
          onOfferSubmit={handleMakeOffer}
          onWhatsAppContact={handleWhatsAppContact}
          onChatContact={handleChatContact}
          isSubmittingOffer={isSubmittingOffer}
        />;
      case 'messages':
        return <Chat />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {userType === 'supplier' ? 'Seller Dashboard' : 'Buyer Dashboard'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {userType === 'supplier' 
            ? 'Manage your car parts business in one place'
            : 'Find and purchase car parts with ease'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mb-4 sm:mb-6 h-auto p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 h-auto"
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate text-center sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="min-h-[400px]">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeDashboard;