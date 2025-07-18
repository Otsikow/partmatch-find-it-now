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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card 
        className="p-4 sm:p-6 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {pendingRequests}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Pending Requests</p>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {matchedRequests}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Matched</p>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {completedRequests}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Completed</p>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToRequests}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {totalRequests}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Total Requests</p>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-card backdrop-blur-sm shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {pendingVerifications}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground font-crimson">Pending Verifications</p>
      </Card>
    </div>
  );
};

export default AdminStats;