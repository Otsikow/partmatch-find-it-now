import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRouter = () => {
  const { user, loading: authLoading, profileLoading, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || profileLoading) {
      console.log("DashboardRouter: Waiting for auth/profile loading");
      return;
    }

    if (!user) {
      console.log("DashboardRouter: No user – redirecting to /auth");
      navigate("/auth", { replace: true });
      return;
    }

    // ✅ Gather user type info with priority order
    const metadataUserType = user.user_metadata?.user_type;
    const contextUserType = userType;
    const storedUserType = localStorage.getItem("userType");
    const finalUserType = metadataUserType || contextUserType || storedUserType;

    // ✅ Persist user type to localStorage if not already stored
    if (finalUserType && !storedUserType) {
      localStorage.setItem("userType", finalUserType);
      console.log("DashboardRouter: Stored user type in localStorage:", finalUserType);
    }

    const isSupplier = finalUserType === "supplier";
    const isAdmin = finalUserType === "admin";
    const isOwner = finalUserType === "owner" || (!finalUserType); // Default to owner if no type

    const currentPath = window.location.pathname;
    console.log("DashboardRouter: Current path:", currentPath, "User type:", finalUserType);

    // ✅ Always redirect to correct dashboard based on user type
    if (isSupplier && !currentPath.includes("seller-dashboard")) {
      console.log("DashboardRouter: Redirecting supplier to /seller-dashboard");
      navigate("/seller-dashboard", { replace: true });
      return;
    }
    
    if (isAdmin && !currentPath.includes("/admin")) {
      console.log("DashboardRouter: Redirecting admin to /admin");
      navigate("/admin", { replace: true });
      return;
    }
    
    if (isOwner && !currentPath.includes("buyer-dashboard")) {
      console.log("DashboardRouter: Redirecting owner to /buyer-dashboard");
      navigate("/buyer-dashboard", { replace: true });
      return;
    }

    // ✅ Handle part draft recovery for sellers
    const partDraft = localStorage.getItem("part_draft");
    if (partDraft && isSupplier && currentPath.includes("seller-dashboard")) {
      console.log("DashboardRouter: Found part draft – returning seller to /sell");
      navigate("/sell", { replace: true });
      return;
    }

    console.log("DashboardRouter: User is on correct dashboard");
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