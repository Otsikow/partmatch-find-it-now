
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
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/partmatch-hero-logo.png" 
              alt="PartMatch Logo" 
              className="h-48 w-auto object-cover"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight">
            Find Car Parts in Ghana
          </h2>
        </div>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          The easiest way to find and order car parts in Ghana. Compare prices from trusted suppliers and get quality parts delivered to your door.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
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
