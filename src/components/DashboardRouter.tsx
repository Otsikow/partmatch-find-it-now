import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRouter = () => {
  const { user, loading: authLoading, profileLoading, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading || profileLoading) {
      return;
    }

    // If the user explicitly navigates home, let them.
    if (location.state?.explicitHomeNavigation) {
      navigate("/");
      return;
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    // Determine final user type, falling back to metadata if necessary
    const finalUserType = userType || user.user_metadata?.user_type;
    console.log("DashboardRouter: Final user type for redirection:", finalUserType);

    switch (finalUserType) {
      case "supplier":
        navigate("/seller-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "buyer":
      case "owner":
        console.log(
          "DashboardRouter: Redirecting to buyer dashboard for user_type:",
          finalUserType
        );
        navigate("/buyer-dashboard");
        break;
      default:
        console.log("DashboardRouter: No user type found, redirecting to guest dashboard");
        navigate("/guest-dashboard");
        break;
    }
  }, [
    user,
    navigate,
    authLoading,
    profileLoading,
    userType,
    location.state,
  ]);

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