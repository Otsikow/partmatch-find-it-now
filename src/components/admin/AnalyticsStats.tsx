import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Package, TrendingUp, Star, UserCheck, ShoppingCart } from "lucide-react";

interface AnalyticsStatsProps {
  userMetrics: {
    totalUsers: number;
    activeUsersThisWeek: number;
    activeUsersThisMonth: number;
  };
  productMetrics: {
    totalParts: number;
    partsThisWeek: number;
    partsThisMonth: number;
  };
  transactionMetrics: {
    totalOffers: number;
    successfulTransactions: number;
    totalRevenue: number;
  };
  otherMetrics: {
    verifiedSellers: number;
    verifiedBuyers: number;
    averageSellerRating: number;
  };
  onNavigateToUsers?: () => void;
  onNavigateToOffers?: () => void;
  onNavigateToVerifications?: () => void;
  onNavigateToRequests?: () => void;
}

const AnalyticsStats = ({
  userMetrics,
  productMetrics,
  transactionMetrics,
  otherMetrics,
  onNavigateToUsers,
  onNavigateToOffers,
  onNavigateToVerifications,
  onNavigateToRequests
}: AnalyticsStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card 
        className="p-3 sm:p-4 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToUsers}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {userMetrics.totalUsers}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Total Users</p>
        <div className="mt-1 text-xs text-muted-foreground">
          <p>Active this week: {userMetrics.activeUsersThisWeek}</p>
          <p>Active this month: {userMetrics.activeUsersThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {productMetrics.totalParts}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Total Parts Listed</p>
        <div className="mt-1 text-xs text-muted-foreground">
          <p>This week: {productMetrics.partsThisWeek}</p>
          <p>This month: {productMetrics.partsThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          GHS {transactionMetrics.totalRevenue.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Total Revenue</p>
        <div className="mt-1 text-xs text-muted-foreground">
          <p>Total offers: {transactionMetrics.totalOffers}</p>
          <p>Successful: {transactionMetrics.successfulTransactions}</p>
        </div>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {otherMetrics.averageSellerRating.toFixed(1)}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Avg Seller Rating</p>
        <div className="mt-1 text-xs text-muted-foreground">
          <p>Verified sellers: {otherMetrics.verifiedSellers}</p>
          <p>Verified buyers: {otherMetrics.verifiedBuyers}</p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsStats;
