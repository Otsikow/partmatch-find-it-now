import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Plus, User, LayoutDashboard, LogOut } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/ProfileHeader";
const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('User');
  const [userType, setUserType] = useState<string>('owner');
  const [isSigningOut, setIsSigningOut] = useState(false);
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      try {
        const {
          data: profile
        } = await supabase.from('profiles').select('first_name, last_name, user_type').eq('id', user.id).single();
        if (profile) {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setDisplayName(name || user.email?.split('@')[0] || 'User');
          setUserType(profile.user_type || 'owner');
        } else {
          setDisplayName(user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setDisplayName(user.email?.split('@')[0] || 'User');
      }
    };
    fetchUserName();
  }, [user]);
  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      console.log('Sign out completed with graceful error handling');
      toast({
        title: "Signed Out", 
        description: "You have been signed out.",
      });
      navigate('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDashboardClick = () => {
    const dashboardPath = userType === 'supplier' ? '/seller-dashboard' : '/buyer-dashboard';
    navigate(dashboardPath);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <ProfileHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            What would you like to do?
          </h2>
          <p className="text-gray-600 text-lg font-crimson">
            Choose an option below to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
      
          {/* Dashboard */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-purple-700">
                Dashboard
              </h3>
              <p className="text-gray-600 mb-6 font-crimson">
                View your activity and manage your account
              </p>
              <Link to={userType === 'supplier' ? "/seller-dashboard" : "/buyer-dashboard"}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Browse Car Parts */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-emerald-700">
                Browse Car Parts
              </h3>
              <p className="text-gray-600 mb-6 font-crimson">
                Search through available car parts from verified sellers
              </p>
              <Link to="/search-parts">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Browsing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Request Car Parts */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-blue-700">
                Request Car Parts
              </h3>
              <p className="text-gray-600 mb-6 font-crimson">
                Can't find what you need? Request it and sellers will reach out
              </p>
              <Link to="/request-part">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Make Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Supplier Section - Conditional Content */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-8 w-8 text-white" />
              </div>
              {userType === 'supplier' ? <>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-orange-700">
                    Sell Car Parts
                  </h3>
                  <p className="text-gray-600 mb-6 font-crimson">
                    Manage your inventory and sell car parts to grow your business
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/post-part">
                      Start Selling
                    </Link>
                  </Button>
                </> : <>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-orange-700">
                    Become a Seller
                  </h3>
                  <p className="text-gray-600 mb-6 font-crimson">Join as a seller to sell car parts and grow your business</p>
                  <Link to="/seller-auth">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </>}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
          <Button 
            onClick={handleDashboardClick}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Button>
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </div>
      </main>
    </div>;
};
export default Profile;
