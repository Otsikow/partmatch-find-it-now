import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const DashboardRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToUserDashboard = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        console.log('DashboardRouter: Checking user type for:', user.id);
        
        // Get user profile to determine user type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        console.log('DashboardRouter: Profile query result:', { profile, error });

        if (error && error.code !== 'PGRST116') {
          console.error('DashboardRouter: Error fetching profile:', error);
          // Default to buyer dashboard on error
          navigate('/buyer-dashboard');
          return;
        }

        let userType = profile?.user_type;
        
        // If profile doesn't exist, check user metadata
        if (!userType) {
          userType = user.user_metadata?.user_type || 'owner';
          console.log('DashboardRouter: Using metadata user_type:', userType);
        }

        console.log('DashboardRouter: Final user type:', userType);
        
        // Redirect based on user type
        if (userType === 'supplier') {
          console.log('DashboardRouter: Redirecting supplier to seller dashboard');
          navigate('/seller-dashboard');
        } else if (userType === 'admin') {
          console.log('DashboardRouter: Redirecting admin to admin dashboard');
          navigate('/admin');
        } else {
          // For 'owner' and any other user types, go to buyer dashboard
          console.log('DashboardRouter: Redirecting to buyer dashboard for user_type:', userType);
          navigate('/buyer-dashboard');
        }
      } catch (error) {
        console.error('DashboardRouter: Error handling dashboard redirect:', error);
        // Default to buyer dashboard on error
        navigate('/buyer-dashboard');
      } finally {
        setLoading(false);
      }
    };

    redirectToUserDashboard();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default DashboardRouter;