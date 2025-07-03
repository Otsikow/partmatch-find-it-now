
import { Card } from "@/components/ui/card";
import { Clock, Users, CheckCircle, Package, Shield } from "lucide-react";

interface AdminStatsProps {
  pendingRequests: number;
  matchedRequests: number;
  completedRequests: number;
  totalRequests: number;
  pendingVerifications: number;
  onNavigateToVerifications?: () => void;
  onNavigateToRequests?: (tab: string) => void;
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
      <Card 
        className="p-2 sm:p-4 lg:p-6 text-center bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onNavigateToRequests?.('requests')}
      >
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3 shadow-lg">
          <Clock className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
          {pendingRequests}
        </p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">Pending Requests</p>
      </Card>

      <Card 
        className="p-2 sm:p-4 lg:p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onNavigateToRequests?.('requests')}
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3 shadow-lg">
          <Users className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          {matchedRequests}
        </p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">Matched</p>
      </Card>

      <Card 
        className="p-2 sm:p-4 lg:p-6 text-center bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onNavigateToRequests?.('requests')}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3 shadow-lg">
          <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          {completedRequests}
        </p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">Completed</p>
      </Card>

      <Card 
        className="p-2 sm:p-4 lg:p-6 text-center bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onNavigateToRequests?.('requests')}
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3 shadow-lg">
          <Package className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
          {totalRequests}
        </p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">Total Requests</p>
      </Card>

      <Card 
        className="p-2 sm:p-4 lg:p-6 text-center bg-gradient-to-br from-white/90 to-indigo-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer col-span-2 sm:col-span-1"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-2 sm:p-3 w-fit mx-auto mb-2 sm:mb-3 shadow-lg">
          <Shield className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <p className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
          {pendingVerifications}
        </p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">Pending Verifications</p>
      </Card>
    </div>
  );
};

export default AdminStats;
