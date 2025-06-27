
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
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
        <Link to="/request" className="block group">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-red-50/50 group-hover:scale-105 cursor-pointer">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us what you need and get multiple competitive offers from verified suppliers near you.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/search-map" className="block group">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-yellow-50/50 group-hover:scale-105 cursor-pointer">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Nearby</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our interactive map to discover parts and suppliers in your area for quick pickup.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/auth" className="block group">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50 group-hover:scale-105 cursor-pointer">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sell Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                List your inventory and reach customers across Ghana. Simple, secure, and profitable.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default FeaturesSection;
