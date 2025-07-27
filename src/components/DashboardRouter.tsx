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

    const currentPath = window.location.pathname;
    const dashboardPaths = ["/seller-dashboard", "/buyer-dashboard", "/admin"];
    const isDashboardPage = dashboardPaths.some(path =>
      currentPath.startsWith(path)
    );

    // ✅ 1. If we're not on a dashboard page, don't trigger redirects
    if (!isDashboardPage) {
      console.log("DashboardRouter: Not a dashboard page – skipping redirect logic");
      return;
    }

    // ✅ 2. Gather user type info
    const metadataUserType = user.user_metadata?.user_type;
    const contextUserType = userType;
    const storedUserType = localStorage.getItem("userType");
    const finalUserType = metadataUserType || contextUserType || storedUserType;

    const isSupplier = finalUserType === "supplier";
    const isAdmin = finalUserType === "admin";
    const isOwner = finalUserType === "owner";

    // ✅ 3. If user is already on correct dashboard, do nothing
    if (currentPath.includes("seller-dashboard") && isSupplier) return;
    if (currentPath.includes("admin") && isAdmin) return;
    if (currentPath.includes("buyer-dashboard") && isOwner) return;

    // ✅ 4. Optional recovery: if on dashboard but a `part_draft` exists, go back to `/sell`
    const partDraft = localStorage.getItem("part_draft");
    if (partDraft && currentPath.includes("seller-dashboard")) {
      console.log("DashboardRouter: Found part draft – returning seller to /sell");
      navigate("/sell", { replace: true });
      return;
    }

    // ✅ 5. Final redirect logic (if truly needed)
    if (isSupplier) {
      console.log("DashboardRouter: Redirecting supplier to /seller-dashboard");
      navigate("/seller-dashboard", { replace: true });
    } else if (isAdmin) {
      console.log("DashboardRouter: Redirecting admin to /admin");
      navigate("/admin", { replace: true });
    } else {
      console.log("DashboardRouter: Redirecting to /buyer-dashboard (default)");
      navigate("/buyer-dashboard", { replace: true });
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