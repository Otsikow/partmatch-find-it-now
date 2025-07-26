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

    // Get user type from multiple sources with priority order
    const metadataUserType = user.user_metadata?.user_type;
    const contextUserType = userType;
    
    let storedUserType = null;
    try {
      storedUserType = localStorage.getItem("userType");
    } catch (e) {
      console.warn("DashboardRouter: Could not access localStorage", e);
    }
    
    console.log(
      "DashboardRouter: === DEBUGGING USER TYPE ===",
      { 
        metadataUserType,
        contextUserType,
        storedUserType,
        email: user.email,
        userMetadata: user.user_metadata,
        currentPath: window.location.pathname,
        fullUser: user
      }
    );

    // PRIORITY: Always check metadata first since it's most reliable
    if (metadataUserType === 'supplier') {
      console.log("DashboardRouter: Found supplier in metadata, redirecting to seller dashboard");
      navigate("/seller-dashboard", { replace: true });
      return;
    }

    if (metadataUserType === 'admin') {
      console.log("DashboardRouter: Found admin in metadata, redirecting to admin dashboard");
      navigate("/admin", { replace: true });
      return;
    }

    // Check if we're already on the correct path and user has supplier anywhere
    const currentPath = window.location.pathname;
    const isSupplierAnywhere = contextUserType === 'supplier' || storedUserType === 'supplier';
    
    if (currentPath.includes('seller-dashboard') && isSupplierAnywhere) {
      console.log("DashboardRouter: User is on seller dashboard and has supplier type, staying here");
      return; // Don't redirect, stay on current seller dashboard
    }

    // Fallback to context or stored user type
    const finalUserType = contextUserType || storedUserType;

    // Standard redirect logic
    switch (finalUserType) {
      case "supplier":
        console.log("DashboardRouter: Redirecting supplier to seller dashboard (fallback)");
        navigate("/seller-dashboard", { replace: true });
        break;
      case "admin":
        console.log("DashboardRouter: Redirecting admin to admin dashboard (fallback)");
        navigate("/admin", { replace: true });
        break;
      case "owner":
        console.log("DashboardRouter: Redirecting to buyer dashboard");
        navigate("/buyer-dashboard", { replace: true });
        break;
      default:
        // Final fallback: if we have stored type but no other indicators
        if (storedUserType === 'supplier') {
          console.log("DashboardRouter: Found supplier in localStorage (final fallback), redirecting to seller dashboard");
          navigate("/seller-dashboard", { replace: true });
        } else if (metadataUserType === 'owner' || !finalUserType) {
          console.log("DashboardRouter: Defaulting to buyer dashboard");
          navigate("/buyer-dashboard", { replace: true });
        } else {
          console.log("DashboardRouter: No valid user type found, redirecting to auth");
          navigate("/auth", { replace: true });
        }
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