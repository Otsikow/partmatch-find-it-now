
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle } from "lucide-react";

interface SellerStatsProps {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  onNavigateToOffers?: () => void;
}

const SellerStats = ({ totalOffers, pendingOffers, acceptedOffers, onNavigateToOffers }: SellerStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 lg:mb-8">
      <Card 
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Offers</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">{totalOffers}</p>
            </div>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-700">{pendingOffers}</p>
            </div>
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-600 font-medium">Accepted</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">{acceptedOffers}</p>
            </div>
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerStats;
