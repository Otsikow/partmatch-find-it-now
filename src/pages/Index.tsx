
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import EnhancedHomePage from "@/components/home/EnhancedHomePage";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const redirectAuthenticatedUser = async () => {
      // Don't redirect if user explicitly navigated to home page via tab
      // Check if there's a state indicating explicit navigation
      const isExplicitNavigation = location.state?.explicitHomeNavigation;
      
      if (!user || loading || hasRedirected || isExplicitNavigation) return;

      try {
        console.log('Index: Checking authenticated user type for:', user.id);
        
        // PRIORITY: Check user metadata first (most reliable)
        let userType = user.user_metadata?.user_type;
        console.log('Index: Metadata user_type:', userType);
        
        // Only fetch profile if metadata doesn't have user_type
        if (!userType) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();

          console.log('Index: Profile query result:', { profile, error });
          userType = profile?.user_type || 'owner';
        }

        console.log('Index: Final user type:', userType);
        
        // Only redirect if this is an initial page load (not explicit navigation)
        // We can detect this by checking if the user just landed on the page
        const isInitialLoad = !location.state;
        
        if (isInitialLoad) {
          setHasRedirected(true);
          
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
        }
        // If no specific user type or explicit navigation, stay on homepage
      } catch (error) {
        console.error('Index: Error checking user type:', error);
      }
    };

    redirectAuthenticatedUser();
  }, [user, loading, navigate, location.state, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show home page content for both authenticated and unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted body-text">
      <MobileHeader />
      <div className="pb-20">
        <EnhancedHomePage />
      </div>
      <Footer />
      <MobileBottomTabs />
    </div>
  );
};

export default Index;
