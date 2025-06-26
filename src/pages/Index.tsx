
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, MapPin, Users, Wrench, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      {/* Navigation Header */}
      <nav className="p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
            alt="PartMatch Logo" 
            className="h-8 w-auto"
          />
          <h1 className="text-xl sm:text-2xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            PartMatch Ghana
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user.email}
              </span>
              <Link to="/supplier">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
              Ghana's Premier Car Parts Marketplace
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
              Connect with trusted suppliers across Ghana. Find the exact car parts you need or list your inventory to reach thousands of customers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link to="/request" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Search className="mr-2 h-5 w-5" />
                  Find Parts
                </Button>
              </Link>
              
              <Link to="/search-map" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-blue-600 text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <MapPin className="mr-2 h-5 w-5" />
                  Browse with Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're looking for parts or selling them, our platform makes it simple and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us what you need and get multiple competitive offers from verified suppliers near you.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Nearby</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our interactive map to discover parts and suppliers in your area for quick pickup.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sell Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                List your inventory and reach customers across Ghana. Simple, secure, and profitable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and suppliers across Ghana.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link to="/request" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                <Search className="mr-2 h-5 w-5" />
                Request Parts Now
              </Button>
            </Link>
            
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 shadow-lg">
                <Users className="mr-2 h-5 w-5" />
                <span className="font-medium">Become a Supplier</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Verified Suppliers</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Parts Listed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">16</div>
            <div className="text-gray-600">Regions Covered</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
