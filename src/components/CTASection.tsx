
import { Button } from "@/components/ui/button";
import { Search, Users, Package, Rocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CTASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 mb-4 sm:mb-6">
          <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-white mb-2 sm:mb-0" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-white drop-shadow-lg">
            Ready to Get Started?
          </h2>
        </div>
        <p className="text-base sm:text-xl mb-6 sm:mb-8 text-white/95 max-w-2xl mx-auto drop-shadow-md px-4">
          Join thousands of satisfied customers and suppliers across Ghana.
        </p>
        
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch max-w-sm sm:max-w-2xl mx-auto px-4">
          <Link to="/search-parts" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full bg-white text-red-700 hover:bg-yellow-50 shadow-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Find Car Parts
            </Button>
          </Link>
          
          <Link to="/request-part" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white">
              <Search className="mr-2 h-5 w-5" />
              Request Parts Now
            </Button>
          </Link>

          {user ? (
            <Link to="/supplier-dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white">
                <Package className="mr-2 h-5 w-5" />
                Sell Car Parts
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white" 
              onClick={handleSellPartsClick}
            >
              <Package className="mr-2 h-5 w-5" />
              Sell Car Parts
            </Button>
          )}

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
