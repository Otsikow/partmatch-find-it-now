
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Bell, 
  User, 
  ShoppingCart,
  Search,
  FileText,
  MessageSquare
} from "lucide-react";
import { useTranslation } from "react-i18next";

const BuyerDashboardStats = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Star,
      title: t('rateSellers'),
      description: t('rateCompletedOrders'),
      value: null,
      color: "blue"
    },
    {
      icon: Bell,
      title: t('notifications'),
      description: t('latestAlerts'),
      value: 0,
      color: "green"
    },
    {
      icon: User,
      title: t('profileSettings'),
      description: t('editYourProfile'),
      value: null,
      color: "purple"
    },
    {
      icon: Search,
      title: t('searchParts'),
      description: t('findWhatYouNeed'),
      value: null,
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stat.description}</p>
                  {stat.value !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.value}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BuyerDashboardStats;
