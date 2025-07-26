import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const DashboardRouter = () => {
  const {
    user,
    loading: authLoading,
    profileLoading,
    userType,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth and profile loading are finished
    if (authLoading || profileLoading) {
      console.log(
        "DashboardRouter: Waiting for auth and profile to load...",
        { authLoading, profileLoading }
      );
      return;
    }

    // If no user, redirect to auth page
    if (!user) {
      console.log("DashboardRouter: No user found, redirecting to auth");
      navigate("/auth", { replace: true });
      return;
    }

    // Determine final user type, with priority on metadata first, then userType from profile
    const metadataUserType = user.user_metadata?.user_type;
    const finalUserType = metadataUserType || userType;
    
    console.log(
      "DashboardRouter: Determining user type for redirection:",
      { 
        metadataUserType,
        profileUserType: userType,
        finalUserType,
        email: user.email
      }
    );

    // Special case: if user came from seller auth but profile is "owner", they should go to seller dashboard
    const currentPath = window.location.pathname;
    if (currentPath.includes('seller') && (metadataUserType === 'supplier' || finalUserType === 'supplier')) {
      console.log("DashboardRouter: Keeping seller on seller dashboard based on URL context");
      navigate("/seller-dashboard", { replace: true });
      return;
    }

    // Redirect based on the final user type
    switch (finalUserType) {
      case "supplier":
        console.log(
          "DashboardRouter: Redirecting supplier to seller dashboard"
        );
        navigate("/seller-dashboard", { replace: true });
        break;
      case "admin":
        console.log("DashboardRouter: Redirecting admin to admin dashboard");
        navigate("/admin", { replace: true });
        break;
      case "owner":
        console.log(
          "DashboardRouter: Redirecting to buyer dashboard for user_type:",
          finalUserType
        );
        navigate("/buyer-dashboard", { replace: true });
        break;
      default:
        console.log("DashboardRouter: No user type found, redirecting to auth");
        navigate("/auth", { replace: true });
        break;
    }
  }, [user, navigate, authLoading, profileLoading, userType]);

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