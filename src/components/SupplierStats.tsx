
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle } from "lucide-react";

interface SupplierStatsProps {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
}

const SupplierStats = ({ totalOffers, pendingOffers, acceptedOffers }: SupplierStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Offers</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{totalOffers}</p>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-700">{pendingOffers}</p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Accepted</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{acceptedOffers}</p>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierStats;
