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
        className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToUsers}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          {userMetrics.totalUsers}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Users</p>
        <div className="mt-2 text-xs text-gray-500">
          <p>Active this week: {userMetrics.activeUsersThisWeek}</p>
          <p>Active this month: {userMetrics.activeUsersThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
          {productMetrics.totalParts}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Parts Listed</p>
        <div className="mt-2 text-xs text-gray-500">
          <p>This week: {productMetrics.partsThisWeek}</p>
          <p>This month: {productMetrics.partsThisMonth}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToOffers}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          GHS {transactionMetrics.totalRevenue.toLocaleString()}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Revenue</p>
        <div className="mt-2 text-xs text-gray-500">
          <p>Total offers: {transactionMetrics.totalOffers}</p>
          <p>Successful: {transactionMetrics.successfulTransactions}</p>
        </div>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
          {otherMetrics.averageSellerRating.toFixed(1)}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Avg Seller Rating</p>
        <div className="mt-2 text-xs text-gray-500">
          <p>Verified sellers: {otherMetrics.verifiedSellers}</p>
          <p>Verified buyers: {otherMetrics.verifiedBuyers}</p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsStats;
