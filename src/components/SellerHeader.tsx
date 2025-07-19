import { Button } from "@/components/ui/button";
import { Package, LogOut, Home, ArrowLeft } from "lucide-react";
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
    <header className="p-2 sm:p-4 md:p-6 flex items-center justify-between bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-lg shadow-lg border-b border-white/20">
      {/* Left section - Back button and Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackClick}
          className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white hover:text-white transition-all duration-300 flex-shrink-0 shadow-lg border"
        >
          <ArrowLeft className="h-4 w-4 drop-shadow-lg" />
        </Button>
        <div className="bg-white/30 backdrop-blur-md rounded-lg p-1.5 border border-white/50 shadow-lg flex-shrink-0">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
          />
        </div>
      </div>

      {/* Center section - Title and welcome message */}
      <div className="flex flex-col min-w-0 flex-1 px-2 sm:px-3">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg truncate">
          Seller Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-white/90 drop-shadow-lg truncate">
          Welcome back, {sellerInfo.name}
        </p>
        <VerifiedBadge
          isVerified={sellerInfo.isVerified}
          className="sm:hidden mt-1"
        />
      </div>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <VerifiedBadge
          isVerified={sellerInfo.isVerified}
          className="hidden sm:flex"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white hover:text-white transition-all duration-300 px-2 sm:px-3 shadow-lg border"
        >
          <Home className="h-4 w-4 sm:mr-1 drop-shadow-lg" />
          <span className="hidden sm:inline drop-shadow-lg">{t("home", "Home")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white hover:text-white transition-all duration-300 px-2 sm:px-3 shadow-lg border"
        >
          <LogOut className="h-4 w-4 sm:mr-1 drop-shadow-lg" />
          <span className="hidden sm:inline drop-shadow-lg">{t("signOut", "Sign Out")}</span>
        </Button>
      </div>
    </header>
  );
};

export default SellerHeader;
