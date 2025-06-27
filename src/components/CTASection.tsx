
import { Button } from "@/components/ui/button";
import { Search, Users, Package, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Rocket className="h-8 w-8 text-white" />
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white drop-shadow-lg">
            Ready to Get Started?
          </h2>
        </div>
        <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto drop-shadow-md">
          Join thousands of satisfied customers and suppliers across Ghana.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <Link to="/search" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full bg-white text-red-700 hover:bg-yellow-50 shadow-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Find Car Parts
            </Button>
          </Link>
          
          <Link to="/request" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white">
              <Search className="mr-2 h-5 w-5" />
              Request Parts Now
            </Button>
          </Link>

          <Link to="/supplier" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white">
              <Package className="mr-2 h-5 w-5" />
              Sell Car Parts
            </Button>
          </Link>

          {!user && (
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-green-700 hover:bg-green-800 text-white shadow-lg font-semibold">
                <Users className="mr-2 h-5 w-5" />
                Sign In / Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTASection;
