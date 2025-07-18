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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card 
        className="p-4 sm:p-6 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToUsers}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {userMetrics.totalUsers}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Total Users</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Active this week: {userMetrics.activeUsersThisWeek}</p>
          <p>Active this month: {userMetrics.activeUsersThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {productMetrics.totalParts}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Total Parts Listed</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>This week: {productMetrics.partsThisWeek}</p>
          <p>This month: {productMetrics.partsThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          GHS {transactionMetrics.totalRevenue.toLocaleString()}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Total Revenue</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Total offers: {transactionMetrics.totalOffers}</p>
          <p>Successful: {transactionMetrics.successfulTransactions}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {otherMetrics.averageSellerRating.toFixed(1)}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Avg Seller Rating</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Verified sellers: {otherMetrics.verifiedSellers}</p>
          <p>Verified buyers: {otherMetrics.verifiedBuyers}</p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsStats;
