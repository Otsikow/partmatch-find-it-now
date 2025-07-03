
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import SupplierHeader from "@/components/SupplierHeader";
import SupplierStats from "@/components/SupplierStats";
import SupplierTabs from "@/components/SupplierTabs";
import SupplierWelcomeDashboard from "@/components/SupplierWelcomeDashboard";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useOfferHandling } from "@/hooks/useOfferHandling";

const SupplierDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-parts');
  const [showMainDashboard, setShowMainDashboard] = useState(false);

  const { requests, myOffers, loading, error, refetch } = useSupplierData();
  const { handleMakeOffer, handleWhatsAppContact, isSubmittingOffer } = useOfferHandling(refetch);

  const handleChatContact = (requestId: string, ownerId: string) => {
    // Navigate to chat page with the buyer
    navigate('/chat', { state: { requestId, buyerId: ownerId } });
  };

  // Calculate stats whenever offers change
  const stats = useMemo(() => {
    const totalOffers = myOffers.length;
    const pendingOffers = myOffers.filter(offer => offer.status === 'pending').length;
    const acceptedOffers = myOffers.filter(offer => offer.status === 'accepted').length;
    
    return { totalOffers, pendingOffers, acceptedOffers };
  }, [myOffers]);

  const handleRetry = () => {
    console.log('SupplierDashboard: Retrying data fetch');
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-fit mx-auto mb-4">
            <Package className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleRetry} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <SupplierHeader />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
        {showMainDashboard ? (
          <SupplierWelcomeDashboard onGoToSellerTools={() => setShowMainDashboard(false)} />
        ) : (
          <>
            <SupplierStats
              totalOffers={stats.totalOffers}
              pendingOffers={stats.pendingOffers}
              acceptedOffers={stats.acceptedOffers}
            />

            <SupplierTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              requests={requests}
              offers={myOffers}
              onOfferSubmit={handleMakeOffer}
              onWhatsAppContact={handleWhatsAppContact}
              onChatContact={handleChatContact}
              isSubmittingOffer={isSubmittingOffer}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SupplierDashboard;
