
import { Card } from "@/components/ui/card";
import { Clock, Users, CheckCircle, Package, Shield } from "lucide-react";

interface AdminStatsProps {
  pendingRequests: number;
  matchedRequests: number;
  completedRequests: number;
  totalRequests: number;
  pendingVerifications: number;
  onNavigateToVerifications?: () => void;
}

const AdminStats = ({
  pendingRequests,
  matchedRequests,
  completedRequests,
  totalRequests,
  pendingVerifications,
  onNavigateToVerifications
}: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
          {pendingRequests}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Pending Requests</p>
      </Card>

      <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          {matchedRequests}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Matched</p>
      </Card>

      <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          {completedRequests}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Completed</p>
      </Card>

      <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
          {totalRequests}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Requests</p>
      </Card>

      <Card 
        className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-indigo-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onNavigateToVerifications}
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
          {pendingVerifications}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-crimson">Pending Verifications</p>
      </Card>
    </div>
  );
};

export default AdminStats;
