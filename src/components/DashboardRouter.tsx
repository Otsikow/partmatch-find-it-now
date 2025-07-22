import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const DashboardRouter = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth state is determined
    if (authLoading) {
      console.log("DashboardRouter: Auth state is loading, waiting...");
      return;
    }

    const redirectToUserDashboard = async () => {
      if (!user) {
        console.log("DashboardRouter: No user found, redirecting to auth");
        navigate("/auth");
        return;
      }

      try {
        console.log("DashboardRouter: Checking user type for:", user.id);

        // Retry mechanism to fetch profile
        let profile = null;
        let error = null;
        for (let i = 0; i < 3; i++) {
          const { data, error: queryError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", user.id)
            .single();

          if (data) {
            profile = data;
            error = null;
            break;
          }

          error = queryError;
          if (queryError && queryError.code !== 'PGRST116') {
            break; // Don't retry on critical errors
          }

          console.log(`DashboardRouter: Profile not found, attempt ${i + 1}. Retrying...`);
          await new Promise(res => setTimeout(res, 1000)); // Wait 1 second
        }

        console.log("DashboardRouter: Profile query result:", { profile, error });

        if (error && error.code !== 'PGRST116') {
          console.error("DashboardRouter: Error fetching profile:", error);
          navigate("/buyer-dashboard"); // Default to buyer dashboard on error
          return;
        }

        let userType = profile?.user_type;

        // If profile still doesn't exist, check user metadata as a fallback
        if (!userType) {
          userType = user.user_metadata?.user_type || "owner";
          console.log("DashboardRouter: Using metadata user_type:", userType);
        }

        console.log("DashboardRouter: Final user type:", userType);

        // Redirect based on user type
        switch (userType) {
          case "supplier":
            console.log("DashboardRouter: Redirecting supplier to seller dashboard");
            navigate("/seller-dashboard");
            break;
          case "admin":
            console.log("DashboardRouter: Redirecting admin to admin dashboard");
            navigate("/admin");
            break;
          default:
            console.log("DashboardRouter: Redirecting to buyer dashboard for user_type:", userType);
            navigate("/buyer-dashboard");
            break;
        }
      } catch (error) {
        console.error("DashboardRouter: Error handling dashboard redirect:", error);
        navigate("/buyer-dashboard"); // Default to buyer dashboard on error
      } finally {
        setLoading(false);
      }
    };

    redirectToUserDashboard();
  }, [user, navigate, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default DashboardRouter;