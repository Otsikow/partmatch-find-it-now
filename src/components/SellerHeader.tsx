import { Button } from "@/components/ui/button";
import { Package, LogOut, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const SellerHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sellerInfo, setSellerInfo] = useState<{
    name: string;
    isVerified: boolean;
  }>({ name: t("seller", "Seller"), isVerified: false });

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!user) return;

      try {
        // First check for seller verification
        const { data: verification } = await supabase
          .from("seller_verifications")
          .select("full_name, business_name, verification_status")
          .eq("user_id", user.id)
          .single();

        if (verification) {
          const displayName =
            verification.business_name || verification.full_name || "Seller";
          const isVerified = verification.verification_status === "approved";
          setSellerInfo({ name: displayName, isVerified });
        } else {
          // Fallback to profile data
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, is_verified")
            .eq("id", user.id)
            .single();

          if (profile) {
            const displayName =
              `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
              "Seller";
            setSellerInfo({
              name: displayName,
              isVerified: profile.is_verified || false,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching seller info:", error);
      }
    };

    fetchSellerInfo();
  }, [user]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/seller-auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleHome = () => {
    console.log("SellerHeader: Home button clicked, navigating to /");
    window.location.href = "/";
  };

  return (
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 backdrop-blur-lg shadow-lg border-b border-border/50">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/30 shadow-lg flex items-center gap-2">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PartMatch
          </div>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            {sellerInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {t("dashboard", "Seller Dashboard")}
          </p>
        </div>
        <VerifiedBadge
          isVerified={sellerInfo.isVerified}
          className="hidden sm:flex"
        />

        <div className="flex items-center gap-2 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleHome}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("home", "Home")}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("signOut", "Sign Out")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
