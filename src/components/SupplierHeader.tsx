
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SupplierHeader = () => {
  const { user } = useAuth();
  const [sellerInfo, setSellerInfo] = useState<{
    name: string;
    isVerified: boolean;
  }>({ name: 'Seller', isVerified: false });

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!user) return;

      try {
        // First check for seller verification
        const { data: verification } = await supabase
          .from('seller_verifications')
          .select('full_name, business_name, verification_status')
          .eq('user_id', user.id)
          .single();

        if (verification) {
          const displayName = verification.business_name || verification.full_name || 'Seller';
          const isVerified = verification.verification_status === 'approved';
          setSellerInfo({ name: displayName, isVerified });
        } else {
          // Fallback to profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, is_verified')
            .eq('id', user.id)
            .single();

          if (profile) {
            const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Seller';
            setSellerInfo({ name: displayName, isVerified: profile.is_verified || false });
          }
        }
      } catch (error) {
        console.error('Error fetching seller info:', error);
      }
    };

    fetchSellerInfo();
  }, [user]);

  return (
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-orange-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-600 flex-shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent truncate">
            {sellerInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 truncate">Seller Dashboard</p>
        </div>
        <VerifiedBadge isVerified={sellerInfo.isVerified} className="hidden sm:flex" />
      </div>
    </header>
  );
};

export default SupplierHeader;
