import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthRedirector = () => {
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
      return;
    }

    // If no user, redirect to auth page
    if (!user) {
      navigate("/auth");
      return;
    }

    // Determine final user type, falling back to metadata if necessary
    const finalUserType = userType || user.user_metadata?.user_type;

    // Redirect based on the final user type
    switch (finalUserType) {
      case "supplier":
        navigate("/seller-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "owner":
        navigate("/buyer-dashboard");
        break;
      default:
        navigate("/auth");
        break;
    }
  }, [user, navigate, authLoading, profileLoading, userType]);

  return null;
};

export default AuthRedirector;
