
import MobileHeader from "@/components/MobileHeader";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import MobileHomeContent from "@/components/MobileHomeContent";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show mobile app layout
  return (
    <div className="min-h-screen bg-gray-50 body-text">
      <MobileHeader />
      <div className="pt-16 pb-20">
        <MobileHomeContent />
      </div>
      <Footer />
      <MobileBottomTabs />
    </div>
  );
};

export default Index;
