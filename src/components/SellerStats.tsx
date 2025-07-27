
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle } from "lucide-react";

interface SellerStatsProps {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  totalParts: number;
  onNavigateToOffers?: () => void;
}

const SellerStats = ({ totalOffers, pendingOffers, acceptedOffers, totalParts, onNavigateToOffers }: SellerStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 lg:mb-8">
      <Card 
        className="bg-card hover:bg-accent/50 border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">My Parts</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{totalParts}</p>
            </div>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card 
        className="bg-card hover:bg-accent/50 border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Offers</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{totalOffers}</p>
            </div>
            <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-card hover:bg-accent/50 border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{pendingOffers}</p>
            </div>
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-warning" />
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-card hover:bg-accent/50 border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Accepted</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{acceptedOffers}</p>
            </div>
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-success" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerStats;
