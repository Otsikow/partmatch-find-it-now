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

    const finalUserType = userType || user.user_metadata?.user_type;

    switch (finalUserType) {
      case "supplier":
        navigate("/seller-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "buyer":
      case "owner":
        navigate("/buyer-dashboard");
        break;
      default:
        // Fallback for any other user types or if it's undefined
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