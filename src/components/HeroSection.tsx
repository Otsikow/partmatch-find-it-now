
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Package, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <img 
              src="/lovable-uploads/partmatch-hero-logo.png" 
              alt="PartMatch Logo" 
              className="h-32 sm:h-40 md:h-48 w-auto object-cover"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 mb-4 sm:mb-6">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mb-2 sm:mb-0" />
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight text-center">
            Find Car Parts in Ghana
          </h2>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          The easiest way to find and order car parts in Ghana. Compare prices from trusted suppliers and get quality parts delivered to your door.
        </p>
        
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch max-w-sm sm:max-w-lg mx-auto px-4">
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
            <Button size="lg" variant="outline" className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 shadow-lg font-semibold">
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
