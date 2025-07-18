
import { Zap } from "lucide-react";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";

const StatsSection = () => {
  const { activeParts, activeRequests, partsMatched, sellers, totalUsers, countries, loading } = useRealTimeStats();
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Fast & Reliable</h2>
        <p className="text-lg text-gray-600">Connect with verified sellers in your region</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="p-6">
          <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
            {loading ? '...' : `${activeParts}+`}
          </div>
          <div className="text-gray-600 font-medium">Active Parts</div>
        </div>
        
        <div className="p-6">
          <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
            {loading ? '...' : `${sellers}+`}
          </div>
          <div className="text-gray-600 font-medium">Sellers</div>
        </div>
        
        <div className="p-6">
          <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
            {loading ? '...' : `${totalUsers}+`}
          </div>
          <div className="text-gray-600 font-medium">Users</div>
        </div>
        
        <div className="p-6">
          <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
            {loading ? '...' : `${countries}+`}
          </div>
          <div className="text-gray-600 font-medium">Countries</div>
        </div>
      </div>

      {/* Additional Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
            {loading ? '...' : `${activeRequests}+`}
          </div>
          <div className="text-gray-700 font-medium">Active Requests</div>
          <p className="text-sm text-gray-600 mt-2">Live requests waiting for offers</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8">
          <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
            {loading ? '...' : `${partsMatched}+`}
          </div>
          <div className="text-gray-700 font-medium">Parts Matched</div>
          <p className="text-sm text-gray-600 mt-2">Successful connections made</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
