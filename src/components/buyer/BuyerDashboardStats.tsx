
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Clock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const BuyerDashboardStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeRequests: 0,
    totalOffers: 0,
    completedTransactions: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch active requests
      const { count: activeRequestsCount } = await supabase
        .from('part_requests')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user?.id)
        .eq('status', 'pending');

      // Fetch total offers received
      const { count: totalOffersCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .in('request_id', 
          (await supabase
            .from('part_requests')
            .select('id')
            .eq('owner_id', user?.id)
          ).data?.map(r => r.id) || []
        );

      // Fetch completed transactions
      const { count: completedCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('transaction_completed', true)
        .in('request_id', 
          (await supabase
            .from('part_requests')
            .select('id')
            .eq('owner_id', user?.id)
          ).data?.map(r => r.id) || []
        );

      // Fetch user profile for rating
      const { data: profile } = await supabase
        .from('profiles')
        .select('rating, total_ratings')
        .eq('id', user?.id)
        .single();

      setStats({
        activeRequests: activeRequestsCount || 0,
        totalOffers: totalOffersCount || 0,
        completedTransactions: completedCount || 0,
        averageRating: profile?.rating || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Active requests',
      value: loading ? '...' : stats.activeRequests.toString(),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      route: '/buyer-dashboard?tab=requests'
    },
    {
      title: 'Total offers',
      value: loading ? '...' : stats.totalOffers.toString(),
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      route: '/buyer-dashboard?tab=orders'
    },
    {
      title: 'Completed orders',
      value: loading ? '...' : stats.completedTransactions.toString(),
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      route: '/buyer-dashboard?tab=orders&status=completed'
    },
    {
      title: 'Average rating',
      value: loading ? '...' : stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      route: '/buyer-dashboard?tab=profile'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat, index) => (
          <Card 
            key={index} 
            className={`group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform ${stat.bgColor} ${stat.borderColor} border-2 backdrop-blur-sm`}
            onClick={() => handleCardClick(stat.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`p-2 sm:p-3 rounded-full bg-white/80 shadow-sm group-hover:shadow-md transition-all`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
