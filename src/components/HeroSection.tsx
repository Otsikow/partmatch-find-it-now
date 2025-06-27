
import { Button } from "@/components/ui/button";
import { Search, MapPin, Package, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/abc7bc58-f2e2-45a1-a524-3f34a3356819.png" 
            alt="PartMatch - Find Car Parts in Ghana" 
            className="w-64 h-auto mx-auto mb-6 drop-shadow-lg"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight">
            Find Car Parts in Ghana
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with trusted suppliers across Ghana. Get competitive prices for quality car parts delivered to your location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link to="/search" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white shadow-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Find Car Parts
            </Button>
          </Link>
          
          <Link to="/search-map" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 shadow-lg font-semibold">
              <MapPin className="mr-2 h-5 w-5" />
              Browse Car Parts
            </Button>
          </Link>

          <Link to="/supplier" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white shadow-lg font-semibold">
              <Package className="mr-2 h-5 w-5" />
              Sell Car Parts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
