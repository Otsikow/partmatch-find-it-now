
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Package, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFirstName(profile.first_name);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('Sign out completed with graceful error handling');
    }
  };

  const getDisplayName = () => {
    if (firstName) return firstName;
    return user?.email || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
              alt="PartMatch Logo" 
              className="h-6 w-auto sm:h-8"
            />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Welcome to PartMatch
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">
            {getDisplayName()}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
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
                Search through available car parts from verified suppliers
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
                Can't find what you need? Request it and suppliers will reach out
              </p>
              <Link to="/request-part">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Make Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Post Car Parts */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-orange-700">
                Become a Supplier
              </h3>
              <p className="text-gray-600 mb-6 font-crimson">
                Join as a supplier to sell car parts and grow your business
              </p>
              <Link to="/supplier-dashboard">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
