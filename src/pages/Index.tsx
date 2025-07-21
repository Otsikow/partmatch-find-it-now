
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import MobileHomeContent from "@/components/MobileHomeContent";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectAuthenticatedUser = async () => {
      if (!user || loading) return;

      try {
        console.log('Index: Checking authenticated user type for:', user.id);
        
        // Get user profile to determine user type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        console.log('Index: Profile query result:', { profile, error });

        let userType = profile?.user_type;
        
        // If profile doesn't exist, check user metadata
        if (!userType) {
          userType = user.user_metadata?.user_type || 'owner';
          console.log('Index: Using metadata user_type:', userType);
        }

        console.log('Index: Final user type:', userType);
        
        // Redirect based on user type
        if (userType === 'supplier') {
          console.log('Index: Redirecting supplier to seller dashboard');
          navigate('/seller-dashboard');
        } else if (userType === 'admin') {
          console.log('Index: Redirecting admin to admin dashboard');
          navigate('/admin');
        } else if (userType === 'owner') {
          // For owners (buyers), redirect to buyer dashboard
          console.log('Index: Redirecting owner to buyer dashboard');
          navigate('/buyer-dashboard');
        }
        // If no specific user type, stay on homepage
      } catch (error) {
        console.error('Index: Error checking user type:', error);
      }
    };

    redirectAuthenticatedUser();
  }, [user, loading, navigate]);

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

  // Show mobile app layout for unauthenticated users
  return (
    <div className="min-h-screen bg-background body-text">
      <MobileHeader />
      <div className="pb-20">
        <MobileHomeContent />
      </div>
      <Footer />
      <MobileBottomTabs />
    </div>
  );
};

export default Index;
