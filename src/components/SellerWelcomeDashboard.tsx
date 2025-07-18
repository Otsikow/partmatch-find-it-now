
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface SupplierWelcomeDashboardProps {
  onGoToSellerTools: () => void;
}

const SupplierWelcomeDashboard = ({ onGoToSellerTools }: SupplierWelcomeDashboardProps) => {
  return (
    <>
      {/* Welcome Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
          <Package className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-4 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
          Seller Dashboard
        </h2>
        <p className="text-muted-foreground text-lg font-crimson">
          What would you like to do?
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Sell Car Parts */}
        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-orange-700">
              Sell Car Parts
            </h3>
            <p className="text-muted-foreground mb-6 font-crimson">
              Manage your inventory, offers, and customer requests
            </p>
            <Button 
              onClick={onGoToSellerTools}
              className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to Seller Tools
            </Button>
          </CardContent>
        </Card>

        {/* Browse Car Parts */}
        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-emerald-700">
              Browse Car Parts
            </h3>
            <p className="text-muted-foreground mb-6 font-crimson">
              Search through available car parts from other sellers
            </p>
            <Link to="/search-parts">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Start Browsing
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Request Car Parts */}
        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-blue-700">
              Request Car Parts
            </h3>
            <p className="text-muted-foreground mb-6 font-crimson">
              Can't find what you need? Request it and other sellers will reach out
            </p>
            <Link to="/request-part">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Make Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SupplierWelcomeDashboard;
