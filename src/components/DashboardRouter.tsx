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
    const currentDomain = window.location.hostname;
    console.log("DashboardRouter: STEP 1 - Resolving user type", {
      authLoading,
      profileLoading,
      user: user?.id,
      userEmail: user?.email,
      userMetadata: user?.user_metadata,
      currentDomain,
      environment: currentDomain.includes('partmatch.app') ? 'production' : 'development'
    });

    const resolveUserType = async () => {
      if (!user) {
        console.log("DashboardRouter: STEP 1A - No user found, domain:", currentDomain);
        setUserTypeResolved(true);
        return;
      }

      console.log("DashboardRouter: STEP 1B - User found, resolving type for domain:", currentDomain);

      // Priority order for user type detection with enhanced logging
      let finalUserType = null;

      // 1. Check user metadata first (most reliable)
      if (user.user_metadata?.user_type) {
        finalUserType = user.user_metadata.user_type;
        console.log("DashboardRouter: STEP 2A - Found userType in metadata:", finalUserType, "Domain:", currentDomain);
      }
      // 2. Check AuthContext userType
      else if (userType) {
        finalUserType = userType;
        console.log("DashboardRouter: STEP 2B - Found userType in context:", finalUserType, "Domain:", currentDomain);
      }
      // 3. Check localStorage with domain-specific fallback
      else {
        const storedUserType = localStorage.getItem("userType");
        const domainSpecificUserType = localStorage.getItem(`userType_${currentDomain}`);
        
        if (domainSpecificUserType) {
          finalUserType = domainSpecificUserType;
          console.log("DashboardRouter: STEP 2C1 - Found domain-specific userType:", finalUserType, "Domain:", currentDomain);
        } else if (storedUserType) {
          finalUserType = storedUserType;
          console.log("DashboardRouter: STEP 2C2 - Found general userType in localStorage:", finalUserType, "Domain:", currentDomain);
        }
      }

      // 4. If still no userType found, query the database with retry for production
      if (!finalUserType) {
        try {
          console.log("DashboardRouter: STEP 2D - Querying database for user type, Domain:", currentDomain);
          
          let attempts = currentDomain.includes('partmatch.app') ? 3 : 1; // Retry for production
          let profile = null;
          let error = null;
          
          while (attempts > 0 && !profile) {
            const result = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', user.id)
              .single();
            
            profile = result.data;
            error = result.error;
            attempts--;
            
            if (!profile && attempts > 0) {
              console.log(`DashboardRouter: Retrying database query, attempts left: ${attempts}`);
              await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
            }
          }

          console.log("DashboardRouter: Database query result:", { profile, error, domain: currentDomain });

          if (!error && profile?.user_type) {
            finalUserType = profile.user_type;
            console.log("DashboardRouter: STEP 2E - Found userType in database:", finalUserType, "Domain:", currentDomain);
          }
        } catch (error) {
          console.error("DashboardRouter: Error querying user type:", error, "Domain:", currentDomain);
        }
      }

      // Store resolved userType with domain-specific backup
      const resolvedType = finalUserType || 'owner'; // Default to owner
      console.log("DashboardRouter: STEP 3 - Final resolved user type:", resolvedType, "Domain:", currentDomain);
      
      setResolvedUserType(resolvedType);
      if (finalUserType) {
        // Store both general and domain-specific versions
        localStorage.setItem("userType", finalUserType);
        localStorage.setItem(`userType_${currentDomain}`, finalUserType);
        console.log("DashboardRouter: STEP 3A - Stored in localStorage:", finalUserType, "Domain:", currentDomain);
      }
      setUserTypeResolved(true);
      console.log("DashboardRouter: STEP 3B - User type resolution complete for domain:", currentDomain);
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
    const navigationState = window.history.state?.usr;
    console.log("DashboardRouter: Routing decision - Path:", currentPath, "UserType:", resolvedUserType, "NavigationState:", navigationState);

    // Skip redirect if user explicitly navigated to home
    if (currentPath === '/' && navigationState?.explicitHomeNavigation) {
      console.log("DashboardRouter: Explicit home navigation detected, skipping redirect");
      return;
    }

    // Route based on resolved user type
    switch (resolvedUserType) {
      case 'supplier':
        if (!currentPath.includes("seller-dashboard")) {
          console.log("DashboardRouter: Redirecting seller to /seller-dashboard");
          navigate("/seller-dashboard", { replace: true });
        }
        break;
      case 'admin':
        if (!currentPath.includes("admin")) {
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