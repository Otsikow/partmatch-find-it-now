import { Search, Plus, Package, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";

const MobileHomeContent = () => {
  const { activeParts, sellers, categories, loading } = useRealTimeStats();
  
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-24 w-auto mx-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Car Parts in Ghana
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            The easiest way to find and order car parts in Ghana. Compare prices from trusted sellers.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/search-parts">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Browse Parts</h4>
                  <p className="text-xs text-gray-500">Find available parts</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/request-part">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Request Part</h4>
                  <p className="text-xs text-gray-500">Can't find it? Ask here</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-3">
          <Link to="/seller-dashboard">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sell Car Parts</h4>
                  <p className="text-xs text-gray-500">List your parts for sale</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Popular Categories</h3>
        
        <div className="space-y-2">
          {[
            { name: "Engine Parts", count: loading ? "..." : `${categories.engineParts}+ parts` },
            { name: "Brake System", count: loading ? "..." : `${categories.brakeParts}+ parts` },
            { name: "Suspension", count: loading ? "..." : `${categories.suspensionParts}+ parts` },
            { name: "Body Parts", count: loading ? "..." : `${categories.bodyParts}+ parts` },
          ].map((category) => (
            <Link
              key={category.name}
              to="/search-parts"
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
        <div className="text-center space-y-2">
          <Zap className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="font-semibold text-gray-900">Fast & Reliable</h3>
          <p className="text-sm text-gray-600">
            Connect with verified sellers across Ghana
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {loading ? '...' : `${activeParts}+`}
            </div>
            <div className="text-xs text-gray-500">Active Parts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {loading ? '...' : `${sellers}+`}
            </div>
            <div className="text-xs text-gray-500">Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">4.8★</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeContent;