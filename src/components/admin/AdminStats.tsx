import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Package, TrendingUp, Star, Clock, CheckCircle } from "lucide-react";

interface AdminStatsProps {
  pendingRequests: number;
  matchedRequests: number;
  completedRequests: number;
  totalRequests: number;
  pendingVerifications: number;
  onNavigateToVerifications?: () => void;
  onNavigateToRequests?: () => void;
}

const AdminStats = ({
  pendingRequests,
  matchedRequests,
  completedRequests,
  totalRequests,
  pendingVerifications,
  onNavigateToVerifications,
  onNavigateToRequests
}: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card 
        className="p-3 sm:p-4 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {pendingRequests}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Pending Requests</p>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {matchedRequests}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Matched</p>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {completedRequests}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Completed</p>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {totalRequests}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Total Requests</p>
      </Card>

      <Card 
        className="p-3 sm:p-4 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-full p-2 w-fit mx-auto mb-2 shadow-lg">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {pendingVerifications}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground font-crimson">Pending Verifications</p>
      </Card>
    </div>
  );
};

export default AdminStats;