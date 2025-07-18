
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Clock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BuyerDashboardStats = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: 'Active requests',
      value: '3',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/buyer-dashboard?tab=requests'
    },
    {
      title: 'Total orders',
      value: '12',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/buyer-dashboard?tab=orders'
    },
    {
      title: 'Completed orders',
      value: '8',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/buyer-dashboard?tab=orders&status=completed'
    },
    {
      title: 'Average rating',
      value: '4.8',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/buyer-dashboard?tab=profile'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 transform"
          onClick={() => handleCardClick(stat.route)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
