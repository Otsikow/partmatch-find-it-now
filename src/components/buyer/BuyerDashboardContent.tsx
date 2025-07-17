
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  MessageSquare,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BuyerNotifications from "./BuyerNotifications";

const BuyerDashboardContent = () => {
  const { t } = useTranslation();

  const quickActions = [
    { icon: Search, label: t('searchParts'), href: "/search-parts" },
    { icon: FileText, label: t('requestPart'), href: "/request-part" },
    { icon: MessageSquare, label: t('viewMessages'), href: "/chat" }
  ];

  const recentActivities = [
    { type: "search", description: "No recent searches", time: "Today" },
    { type: "save", description: "No saved parts", time: "This week" },
    { type: "order", description: "No recent orders", time: "This month" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t('recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t('noRecentActivity')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No featured parts at the moment</p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse All Parts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                  size="sm"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {action.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <BuyerNotifications />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
              <p className="text-sm text-blue-700 mb-2">
                Check our FAQ or contact support for assistance.
              </p>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboardContent;
