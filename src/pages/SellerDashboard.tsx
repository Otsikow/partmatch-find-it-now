import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import SellerHeader from "@/components/SellerHeader";
import SellerStats from "@/components/SellerStats";
import SellerTabs from "@/components/SellerTabs";
import SellerWelcomeDashboard from "@/components/SellerWelcomeDashboard";
import { useSellerData } from "@/hooks/useSellerData";
import { useMyPartsData } from "@/hooks/useMyPartsData";
import { useOfferHandling } from "@/hooks/useOfferHandling";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-parts");
  const [showMainDashboard, setShowMainDashboard] = useState(false);

  const { requests, myOffers, loading, error, refetch } = useSellerData();
  const { myParts, loading: partsLoading, error: partsError, refetch: refetchParts } = useMyPartsData();
  const { handleMakeOffer, handleWhatsAppContact, isSubmittingOffer } =
    useOfferHandling(refetch);

  const handleChatContact = (requestId: string, ownerId: string) => {
    // Navigate to chat page with the buyer
    navigate("/chat", { state: { requestId, buyerId: ownerId } });
  };

  // Calculate stats whenever offers change
  const stats = useMemo(() => {
    const totalOffers = myOffers.length;
    const pendingOffers = myOffers.filter(
      (offer) => offer.status === "pending"
    ).length;
    const acceptedOffers = myOffers.filter(
      (offer) => offer.status === "accepted"
    ).length;

    return { totalOffers, pendingOffers, acceptedOffers };
  }, [myOffers]);

  const handleRetry = () => {
    console.log("SellerDashboard: Retrying data fetch");
    refetch();
    refetchParts();
  };

  if (loading || partsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-fit mx-auto mb-4">
            <Package className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Dashboard Error
          </h2>
          <p className="text-muted-foreground mb-6">{error || partsError}</p>
          <Button
            onClick={handleRetry}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
      <SellerHeader />

      <main className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 lg:py-6 xl:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        {showMainDashboard ? (
          <SellerWelcomeDashboard
            onGoToSellerTools={() => setShowMainDashboard(false)}
          />
        ) : (
          <>
            <SellerStats
              totalOffers={stats.totalOffers}
              pendingOffers={stats.pendingOffers}
              acceptedOffers={stats.acceptedOffers}
              totalParts={myParts.length}
              onNavigateToOffers={() => setActiveTab("offers")}
            />

            <SellerTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              requests={requests}
              offers={myOffers}
              myParts={myParts}
              onOfferSubmit={handleMakeOffer}
              onWhatsAppContact={handleWhatsAppContact}
              onChatContact={handleChatContact}
              isSubmittingOffer={isSubmittingOffer}
              onRefreshParts={refetchParts}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
