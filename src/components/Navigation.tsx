
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import NavigationLogo from "./NavigationLogo";
import NavigationAuth from "./NavigationAuth";
import NavigationMobile from "./NavigationMobile";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
    try {
      console.log('Navigation: Attempting to sign out...');
      setIsMobileMenuOpen(false);
      
      // Always attempt to sign out, but handle missing session gracefully
      await signOut();
      console.log('Navigation: Sign out successful, redirecting to home');
      navigate('/');
      
      // Show success message instead of error
      toast({
        title: "Signed Out Successfully",
        description: "You have been signed out.",
      });
    } catch (error) {
      console.error('Navigation: Sign out error:', error);
      
      // Even if there's an error, clear the UI state and redirect
      navigate('/');
      
      // Show friendly message instead of scary error
      toast({
        title: "Signed Out",
        description: "You have been signed out.",
      });
    }
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
    <nav className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex items-center justify-between bg-white shadow-sm border-b border-gray-100 relative min-h-[56px] sm:min-h-[64px]">
      {/* Logo Section */}
      <NavigationLogo onLinkClick={closeMobileMenu} />
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
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
