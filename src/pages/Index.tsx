import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Package, MapPin, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg">
        {/* Top row with user actions */}
        <div className="flex items-center justify-end mb-4 sm:mb-6">
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <span className="text-base sm:text-lg font-crimson text-gray-600">Welcome back!</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800 font-inter hover:bg-white/50 text-base"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="font-inter border-blue-200 hover:bg-blue-50 text-base">
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        {/* Centered logo and brand name */}
        <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
          <div className="flex items-center gap-4 mb-3">
            <img 
              src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
              alt="PartMatch Logo" 
              className="h-24 w-auto sm:h-28 lg:h-32 drop-shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                PartMatch
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-crimson italic bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Automotive Excellence
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 text-base sm:text-lg max-w-md mx-auto font-crimson leading-relaxed text-center">
          Connect with trusted local car part suppliers — with automated notifications and secure payments
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Need a car part? We'll find it for you!
          </h2>
          <p className="text-gray-700 text-sm sm:text-base px-2 font-crimson leading-relaxed">
            Connect with verified local suppliers or browse available parts
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Customer Actions */}
          <Card className="p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-3 bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">Need a Part?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 font-crimson">
                Tell us what you need and we'll find it for you
              </p>
              <Link to="/request">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Request a Part
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-3 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">Browse Parts</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 font-crimson">
                Search available parts from local suppliers
              </p>
              <Link to="/search">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Search Parts
                </Button>
              </Link>
            </div>
          </Card>

          {/* Supplier Actions */}
          <Card className="p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-3 bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Are you a Supplier?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 font-crimson">
                Manage your parts inventory and fulfill requests
              </p>
              <Link to="/supplier">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Supplier Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Access */}
        {user && (
          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/admin" className="text-xs sm:text-sm text-gray-500 hover:text-indigo-600 font-crimson italic transition-colors duration-300">
              Admin Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
