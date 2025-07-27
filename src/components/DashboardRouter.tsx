import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const DashboardRouter = () => {
  const { user, loading: authLoading, profileLoading, userType } = useAuth();
  const navigate = useNavigate();
  const [userTypeResolved, setUserTypeResolved] = useState(false);
  const [resolvedUserType, setResolvedUserType] = useState<string | null>(null);

  // Resolve user type from multiple sources
  useEffect(() => {
    console.log("DashboardRouter: STEP 1 - Resolving user type", {
      authLoading,
      profileLoading,
      user: user?.id,
      userEmail: user?.email,
      userMetadata: user?.user_metadata
    });

    const resolveUserType = async () => {
      if (!user) {
        console.log("DashboardRouter: STEP 1A - No user found");
        setUserTypeResolved(true);
        return;
      }

      console.log("DashboardRouter: STEP 1B - User found, resolving type");

      // Priority order for user type detection
      let finalUserType = null;

      // 1. Check user metadata first (most reliable)
      if (user.user_metadata?.user_type) {
        finalUserType = user.user_metadata.user_type;
        console.log("DashboardRouter: STEP 2A - Found userType in metadata:", finalUserType);
      }
      // 2. Check AuthContext userType
      else if (userType) {
        finalUserType = userType;
        console.log("DashboardRouter: STEP 2B - Found userType in context:", finalUserType);
      }
      // 3. Check localStorage
      else {
        const storedUserType = localStorage.getItem("userType");
        if (storedUserType) {
          finalUserType = storedUserType;
          console.log("DashboardRouter: STEP 2C - Found userType in localStorage:", finalUserType);
        }
      }

      // 4. If still no userType found, query the database
      if (!finalUserType) {
        try {
          console.log("DashboardRouter: STEP 2D - Querying database for user type");
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();

          console.log("DashboardRouter: Database query result:", { profile, error });

          if (!error && profile?.user_type) {
            finalUserType = profile.user_type;
            console.log("DashboardRouter: STEP 2E - Found userType in database:", finalUserType);
          }
        } catch (error) {
          console.error("DashboardRouter: Error querying user type:", error);
        }
      }

      // Store resolved userType
      const resolvedType = finalUserType || 'owner'; // Default to owner
      console.log("DashboardRouter: STEP 3 - Final resolved user type:", resolvedType);
      
      setResolvedUserType(resolvedType);
      if (finalUserType) {
        localStorage.setItem("userType", finalUserType);
        console.log("DashboardRouter: STEP 3A - Stored in localStorage:", finalUserType);
      }
      setUserTypeResolved(true);
      console.log("DashboardRouter: STEP 3B - User type resolution complete");
    };

    if (authLoading || profileLoading) {
      console.log("DashboardRouter: STEP 0 - Still loading auth/profile");
      return;
    }

    resolveUserType();
  }, [user, authLoading, profileLoading, userType]);

  // Handle routing once user type is resolved
  useEffect(() => {
    if (authLoading || profileLoading || !userTypeResolved) {
      console.log("DashboardRouter: Waiting for user type resolution");
      return;
    }

    if (!user) {
      console.log("DashboardRouter: No user – redirecting to /auth");
      navigate("/auth", { replace: true });
      return;
    }

    const currentPath = window.location.pathname;
    console.log("DashboardRouter: Routing decision - Path:", currentPath, "UserType:", resolvedUserType);

    // Route based on resolved user type
    switch (resolvedUserType) {
      case 'supplier':
        if (!currentPath.includes("seller-dashboard")) {
          console.log("DashboardRouter: Redirecting supplier to /seller-dashboard");
          navigate("/seller-dashboard", { replace: true });
        }
        break;
      case 'admin':
        if (!currentPath.includes("/admin")) {
          console.log("DashboardRouter: Redirecting admin to /admin");
          navigate("/admin", { replace: true });
        }
        break;
      default: // 'owner' or any other type
        if (!currentPath.includes("buyer-dashboard")) {
          console.log("DashboardRouter: Redirecting to /buyer-dashboard (default)");
          navigate("/buyer-dashboard", { replace: true });
        }
        break;
    }
  }, [user, navigate, authLoading, profileLoading, userTypeResolved, resolvedUserType]);

  if (authLoading || profileLoading) {
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