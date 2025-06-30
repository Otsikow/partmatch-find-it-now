
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            How It Works
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you're looking for parts or selling them, our platform makes it simple and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        <Link to="/request-part" className="block group">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-red-50/50 group-hover:scale-105 cursor-pointer h-full">
            <CardContent className="p-6 lg:p-8 flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Car Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us what you need and get multiple competitive offers from verified suppliers near you.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/search-parts" className="block group">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-yellow-50/50 group-hover:scale-105 cursor-pointer h-full">
            <CardContent className="p-6 lg:p-8 flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse Car Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                Search through available car parts from verified suppliers across Ghana.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/seller-auth" className="block group sm:col-span-2 xl:col-span-1 max-w-md mx-auto xl:max-w-none">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50 group-hover:scale-105 cursor-pointer h-full">
            <CardContent className="p-6 lg:p-8 flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sell Car Parts</h3>
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
