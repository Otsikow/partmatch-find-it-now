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

    // Check current path to avoid unnecessary redirects
    const currentPath = window.location.pathname;
    
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
        currentPath,
        fullUser: user
      }
    );

    // PREVENT UNNECESSARY REDIRECTS: Check if user is already on the correct page
    const isSupplierAnywhere = metadataUserType === 'supplier' || contextUserType === 'supplier' || storedUserType === 'supplier';
    const isAdminAnywhere = metadataUserType === 'admin' || contextUserType === 'admin' || storedUserType === 'admin';
    const isOwnerAnywhere = metadataUserType === 'owner' || contextUserType === 'owner' || storedUserType === 'owner';
    
    // If user is already on the correct dashboard, don't redirect
    if (currentPath.includes('seller-dashboard') && isSupplierAnywhere) {
      console.log("DashboardRouter: User is already on seller dashboard, staying here");
      return;
    }
    
    if (currentPath.includes('admin') && isAdminAnywhere) {
      console.log("DashboardRouter: User is already on admin dashboard, staying here");
      return;
    }
    
    if (currentPath.includes('buyer-dashboard') && (isOwnerAnywhere || (!isSupplierAnywhere && !isAdminAnywhere))) {
      console.log("DashboardRouter: User is already on buyer dashboard, staying here");
      return;
    }

    // Only redirect if user is on a dashboard page that doesn't match their type
    const isDashboardPath = currentPath.includes('-dashboard') || currentPath.includes('/admin');
    
    if (!isDashboardPath) {
      console.log("DashboardRouter: User is not on a dashboard page, allowing navigation");
      return;
    }

    // PRIORITY: Always check metadata first since it's most reliable
    if (metadataUserType === 'supplier' && !currentPath.includes('seller-dashboard')) {
      console.log("DashboardRouter: Found supplier in metadata, redirecting to seller dashboard");
      navigate("/seller-dashboard", { replace: true });
      return;
    }

    if (metadataUserType === 'admin' && !currentPath.includes('admin')) {
      console.log("DashboardRouter: Found admin in metadata, redirecting to admin dashboard");
      navigate("/admin", { replace: true });
      return;
    }

    // Fallback to context or stored user type
    const finalUserType = contextUserType || storedUserType;

    // Standard redirect logic (only if on wrong dashboard)
    switch (finalUserType) {
      case "supplier":
        if (!currentPath.includes('seller-dashboard')) {
          console.log("DashboardRouter: Redirecting supplier to seller dashboard (fallback)");
          navigate("/seller-dashboard", { replace: true });
        }
        break;
      case "admin":
        if (!currentPath.includes('admin')) {
          console.log("DashboardRouter: Redirecting admin to admin dashboard (fallback)");
          navigate("/admin", { replace: true });
        }
        break;
      case "owner":
        if (!currentPath.includes('buyer-dashboard')) {
          console.log("DashboardRouter: Redirecting to buyer dashboard");
          navigate("/buyer-dashboard", { replace: true });
        }
        break;
      default:
        // Final fallback: if we have stored type but no other indicators
        if (storedUserType === 'supplier' && !currentPath.includes('seller-dashboard')) {
          console.log("DashboardRouter: Found supplier in localStorage (final fallback), redirecting to seller dashboard");
          navigate("/seller-dashboard", { replace: true });
        } else if ((metadataUserType === 'owner' || !finalUserType) && !currentPath.includes('buyer-dashboard')) {
          console.log("DashboardRouter: Defaulting to buyer dashboard");
          navigate("/buyer-dashboard", { replace: true });
        } else if (!isDashboardPath) {
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