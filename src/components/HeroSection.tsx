
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Package, Zap, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string>('owner');
  const [isLoadingUserType, setIsLoadingUserType] = useState(false);

  // Fetch user type for authenticated users
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) {
        setUserType('owner');
        return;
      }

      setIsLoadingUserType(true);
      try {
        console.log('HeroSection: Fetching user type for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('HeroSection: Error fetching profile:', error);
          setUserType('owner'); // Default fallback
          return;
        }

        if (profile) {
          console.log('HeroSection: User type found:', profile.user_type);
          setUserType(profile.user_type || 'owner');
        } else {
          console.log('HeroSection: No profile found, defaulting to owner');
          setUserType('owner');
        }
      } catch (error) {
        console.error('HeroSection: Error in fetchUserType:', error);
        setUserType('owner'); // Default fallback
      } finally {
        setIsLoadingUserType(false);
      }
    };

    fetchUserType();
  }, [user]);

  const getDashboardRoute = () => {
    console.log('HeroSection: Getting dashboard route for user type:', userType);
    switch (userType) {
      case 'admin': return '/admin';
      case 'supplier': return '/supplier-dashboard';
      case 'owner':
      default: return '/buyer-dashboard';
    }
  };

  const getDashboardLabel = () => {
    console.log('HeroSection: Getting dashboard label for user type:', userType);
    switch (userType) {
      case 'admin': return 'Admin Dashboard';
      case 'supplier': return 'Seller Dashboard';
      case 'owner':
      default: return 'Buyer Dashboard';
    }
  };

  const handleRequestPartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Sign In Required",
        description: "Please sign in to request car parts.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  };

  const handleSellPartsClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Sign In Required",
        description: "Please sign in to sell car parts.",
        variant: "destructive"
      });
      navigate('/seller-auth');
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-hero-gradient-start via-hero-gradient-end to-hero-gradient-start px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <img 
              src="/lovable-uploads/29637275-f42b-4415-b255-b8ae5e5837e1.png" 
              alt="PartMatch Logo" 
              className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain bg-white dark:bg-white rounded-lg p-4 shadow-lg"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 mb-4 sm:mb-6">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-hero-accent mb-2 sm:mb-0" />
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight text-center">
            Find & Sell Car Parts in Ghana
          </h2>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          The easiest way to find and order car parts in Ghana. Compare prices from trusted sellers and get quality parts delivered to your door.
        </p>
        
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch max-w-sm sm:max-w-lg mx-auto px-4">
          {/* Dashboard Button - Only for authenticated users */}
          {user && (
            <Link to={getDashboardRoute()} className="w-full">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg font-semibold"
                disabled={isLoadingUserType}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                {isLoadingUserType ? 'Loading...' : `Go to ${getDashboardLabel()}`}
              </Button>
            </Link>
          )}

          {user ? (
            <Link to="/request-part" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white shadow-lg font-semibold">
                <MessageSquare className="mr-2 h-5 w-5" />
                Request Car Parts
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white shadow-lg font-semibold" 
              onClick={handleRequestPartClick}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Request Car Parts
            </Button>
          )}
          
          <Link to="/search-parts" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-2 border-success text-success hover:bg-success/10 shadow-lg font-semibold">
              <MapPin className="mr-2 h-5 w-5" />
              Find Car Parts
            </Button>
          </Link>

          {user ? (
            <Link to="/supplier-dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white shadow-lg font-semibold">
                <Package className="mr-2 h-5 w-5" />
                Sell Car Parts
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white shadow-lg font-semibold" 
              onClick={handleSellPartsClick}
            >
              <Package className="mr-2 h-5 w-5" />
              Sell Car Parts
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
