
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationLogo from "./NavigationLogo";
import NavigationAuth from "./NavigationAuth";
import NavigationMobile from "./NavigationMobile";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserType(null);
        setFirstName(null);
        return;
      }

      try {
        // First check user metadata
        const metadataUserType = user.user_metadata?.user_type;
        if (metadataUserType) {
          setUserType(metadataUserType);
        }

        // Fetch profile data for first name and user type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type, first_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Use metadata user_type if available, otherwise use profile user_type
          setUserType(metadataUserType || profile.user_type || null);
          setFirstName(profile.first_name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserType(null);
        setFirstName(null);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (userType === 'admin') return '/admin';
    if (userType === 'supplier') return '/supplier';
    return '/buyer-dashboard';
  };

  const getDashboardLabel = () => {
    if (userType === 'admin') return 'Admin Dashboard';
    if (userType === 'supplier') return 'Seller Dashboard';
    return 'Buyer Dashboard';
  };

  const getDisplayName = () => {
    if (firstName) return firstName;
    return user?.email || 'User';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between bg-white shadow-sm border-b border-gray-100 relative">
      {/* Logo Section */}
      <NavigationLogo onLinkClick={closeMobileMenu} />
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6">
        <NavigationAuth
          user={user}
          userType={userType}
          firstName={firstName}
          onSignOut={handleSignOut}
          getDashboardLink={getDashboardLink}
          getDashboardLabel={getDashboardLabel}
          getDisplayName={getDisplayName}
        />
      </div>

      {/* Mobile Navigation */}
      <NavigationMobile
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onSignOut={handleSignOut}
        getDashboardLink={getDashboardLink}
        getDashboardLabel={getDashboardLabel}
        getDisplayName={getDisplayName}
        closeMobileMenu={closeMobileMenu}
      />
    </nav>
  );
};

export default Navigation;
