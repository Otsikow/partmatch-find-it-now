import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SellerProtectedRouteProps {
  children: React.ReactNode;
}

const SellerProtectedRoute = ({ children }: SellerProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkUserAccess = async () => {
      if (!user) {
        console.log("SellerProtectedRoute: No user found");
        setProfileLoading(false);
        return;
      }

      console.log("SellerProtectedRoute: Checking access for user:", user.id);
      console.log("SellerProtectedRoute: User metadata:", user.user_metadata);

      // First check user metadata directly (most reliable)
      const metadataUserType = user.user_metadata?.user_type;
      console.log("SellerProtectedRoute: Metadata user_type:", metadataUserType);

      if (metadataUserType === "supplier" || metadataUserType === "admin") {
        console.log("SellerProtectedRoute: User is supplier or admin based on metadata");
        setUserType(metadataUserType);
        setProfileLoading(false);
        return;
      }

      // Check localStorage as backup
      const storedUserType = localStorage.getItem("userType");
      console.log("SellerProtectedRoute: localStorage userType:", storedUserType);
      
      if (storedUserType === "supplier" || storedUserType === "admin") {
        console.log("SellerProtectedRoute: User is supplier or admin based on localStorage");
        setUserType(storedUserType);
        setProfileLoading(false);
        return;
      }

      // If no metadata, check profile table as last resort
      try {
        console.log("SellerProtectedRoute: Querying profile table for user type");
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        console.log("SellerProtectedRoute: Profile query result:", { profile, error });

        if (error) {
          console.error("SellerProtectedRoute: Error fetching profile:", error);
          // If profile fetch fails but we have valid metadata, use metadata
          if (metadataUserType === "supplier" || metadataUserType === "admin") {
            console.log("SellerProtectedRoute: Profile fetch failed, but using valid metadata:", metadataUserType);
            setUserType(metadataUserType);
          } else {
            // No profile found and no supplier/admin metadata - deny access
            console.log("SellerProtectedRoute: No valid user type found - denying access");
            setUserType("not_authorized");
          }
        } else {
          const profileUserType = profile?.user_type;
          console.log("SellerProtectedRoute: Profile user_type:", profileUserType);
          setUserType(profileUserType || "not_authorized");
          
          // Store in localStorage for future use
          if (profileUserType) {
            localStorage.setItem("userType", profileUserType);
            console.log("SellerProtectedRoute: Stored userType in localStorage:", profileUserType);
          }
        }
      } catch (error) {
        console.error("SellerProtectedRoute: Unexpected error:", error);
        // If any error occurs but we have valid metadata, use metadata
        if (metadataUserType === "supplier" || metadataUserType === "admin") {
          console.log("SellerProtectedRoute: Unexpected error, but using valid metadata:", metadataUserType);
          setUserType(metadataUserType);
        } else {
          setUserType("not_authorized");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    checkUserAccess();
  }, [user]);

  console.log("SellerProtectedRoute: Current state:", {
    loading,
    profileLoading,
    userType,
    userId: user?.id,
    userEmail: user?.email,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("SellerProtectedRoute: No user, redirecting to seller auth");
    return <Navigate to="/seller-auth" replace />;
  }

  if (userType !== "supplier" && userType !== "admin") {
    console.log("SellerProtectedRoute: Access denied, userType:", userType);
    toast({
      title: "Access Denied",
      description:
        "Only registered sellers can access this dashboard. Please register as a seller first.",
      variant: "destructive",
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  // Special case: If user is admin, show a warning but allow access
  if (userType === "admin") {
    console.log("SellerProtectedRoute: Admin accessing seller dashboard");
  }

  console.log("SellerProtectedRoute: Access granted for supplier or admin");
  return <>{children}</>;
};

export default SellerProtectedRoute;