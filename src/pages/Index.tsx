

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Package, MapPin, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 text-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4 justify-center">
            <img 
              src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
              alt="PartMatch Logo" 
              className="h-16 w-auto sm:h-20 lg:h-24"
            />
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900">PartMatch</h1>
              <p className="text-sm sm:text-base lg:text-lg font-crimson italic text-gray-600">Automotive Excellence</p>
            </div>
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <span className="text-sm font-crimson text-gray-600">Welcome back!</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="font-inter">
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto font-crimson leading-relaxed">
          Connect with trusted local car part suppliers — with automated notifications and secure payments
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-playfair font-bold text-gray-900 mb-2 sm:mb-3">
            Need a car part? We'll find it for you!
          </h2>
          <p className="text-gray-600 text-sm sm:text-base px-2 font-crimson leading-relaxed">
            Connect with verified local suppliers or browse available parts
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-3 sm:space-y-4">
          {/* Customer Actions */}
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-blue-100">
            <div className="text-center">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2">Need a Part?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-crimson">
                Tell us what you need and we'll find it for you
              </p>
              <Link to="/request">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 text-base sm:text-lg rounded-xl font-inter font-medium">
                  Request a Part
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-green-100">
            <div className="text-center">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2">Browse Parts</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-crimson">
                Search available parts from local suppliers
              </p>
              <Link to="/search">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 text-base sm:text-lg rounded-xl font-inter font-medium">
                  Search Parts
                </Button>
              </Link>
            </div>
          </Card>

          {/* Supplier Actions */}
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-orange-100">
            <div className="text-center">
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2">Are you a Supplier?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-crimson">
                Manage your parts inventory and fulfill requests
              </p>
              <Link to="/supplier">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 sm:py-3 text-base sm:text-lg rounded-xl font-inter font-medium">
                  Supplier Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Access */}
        {user && (
          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/admin" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-crimson italic">
              Admin Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

