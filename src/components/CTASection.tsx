
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-6 text-white drop-shadow-lg">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto drop-shadow-md">
          Join thousands of satisfied customers and suppliers across Ghana.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link to="/request" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full bg-white text-red-700 hover:bg-yellow-50 shadow-lg font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Request Parts Now
            </Button>
          </Link>
          
          <Link to="/auth" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold border-2 border-white">
              <Users className="mr-2 h-5 w-5" />
              Become a Seller
            </Button>
          </Link>

          {!user && (
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-green-700 hover:bg-green-800 text-white shadow-lg font-semibold">
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
