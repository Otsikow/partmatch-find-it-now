
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
      <header className="p-3 sm:p-4 md:p-6 border-b bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg">
        {/* Top row with user actions */}
        <div className="flex items-center justify-end mb-3 sm:mb-4 md:mb-6">
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationBell />
              <span className="text-sm sm:text-base md:text-lg font-crimson text-gray-600 hidden sm:inline">Welcome back!</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800 font-inter hover:bg-white/50 text-xs sm:text-sm md:text-base px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="font-inter border-blue-200 hover:bg-blue-50 text-xs sm:text-sm md:text-base px-2 sm:px-3">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
        
        {/* Centered logo at the top */}
        <div className="flex flex-col items-center justify-center mb-3 sm:mb-4 md:mb-6">
          <img 
            src="/lovable-uploads/846aa041-c3b2-42f1-8842-2348e4ced1a4.png" 
            alt="PartMatch Logo" 
            className="h-24 w-auto sm:h-32 md:h-40 lg:h-48 drop-shadow-lg"
          />
          <div className="text-center mt-1 sm:mt-2">
            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-crimson italic bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Automotive Excellence
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-lg mx-auto font-crimson leading-relaxed text-center px-2">
          Connect with trusted local car part suppliers — with automated notifications and secure payments
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 px-2">
            Need a car part? We'll find it for you!
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-2 font-crimson leading-relaxed">
            Connect with verified local suppliers or browse available parts
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Customer Actions */}
          <Card className="p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">Need a Part?</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 font-crimson px-2">
                Tell us what you need and we'll find it for you
              </p>
              <Link to="/request">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Request a Part
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg">
                <Search className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">Browse Parts</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 font-crimson px-2">
                Search available parts from local suppliers
              </p>
              <Link to="/search">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Search Parts
                </Button>
              </Link>
            </div>
          </Card>

          {/* Supplier Actions */}
          <Card className="p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-full p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg">
                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Are you a Supplier?</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 font-crimson px-2">
                Manage your parts inventory and fulfill requests
              </p>
              <Link to="/supplier">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Supplier Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Access */}
        {user && (
          <div className="mt-6 sm:mt-8 md:mt-10 text-center">
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
