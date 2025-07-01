
import { MapPin, Search, Package } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
              How It Works
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're looking for parts or selling them, our platform makes it simple and secure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Request Car Parts */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Request Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Tell us what you need and get multiple competitive offers from verified suppliers near you.
            </p>
          </div>

          {/* Browse Car Parts */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Browse Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Search through available car parts from verified suppliers across Ghana.
            </p>
          </div>

          {/* Sell Car Parts */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Sell Car Parts</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              List your inventory and reach customers across Ghana. Simple, secure, and profitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
