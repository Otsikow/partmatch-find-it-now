
import { MapPin, Search, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const FeaturesSection = () => {
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
    <div className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mb-2 sm:mb-0 sm:mr-3">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-900">
              How It Works
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Whether you're looking for parts or selling them, our platform makes it simple and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Request Car Parts */}
          <Link to="/request-part" className="block bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Request Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Tell us what you need and get multiple competitive offers from verified sellers near you.
            </p>
          </Link>

          {/* Browse Car Parts */}
          <Link to="/search-parts" className="block bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Browse Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Search through available car parts from verified sellers across Ghana.
            </p>
          </Link>

          {/* Sell Car Parts */}
          <Link to="/post-part" className="block bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Sell Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              List your inventory and reach customers across Ghana. Simple, secure, and profitable.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
