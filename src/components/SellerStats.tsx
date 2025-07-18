
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
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Offers</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300">{totalOffers}</p>
            </div>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingOffers}</p>
            </div>
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Accepted</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 dark:text-green-300">{acceptedOffers}</p>
            </div>
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerStats;
