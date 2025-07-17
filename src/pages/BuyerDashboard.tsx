
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import BuyerDashboardHeader from "@/components/buyer/BuyerDashboardHeader";
import BuyerDashboardStats from "@/components/buyer/BuyerDashboardStats";
import BuyerDashboardTabs from "@/components/buyer/BuyerDashboardTabs";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="pt-16 pb-20 px-4 space-y-6">
          {/* Mobile Welcome Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{t('welcomeBack')}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          <BuyerDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <MobileBottomTabs />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <BuyerDashboardHeader />
        <BuyerDashboardStats />
        <BuyerDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
