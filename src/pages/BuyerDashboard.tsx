
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Bell, 
  User, 
  MessageSquare, 
  Eye, 
  Home,
  Info,
  Settings,
  Search,
  MapPin,
  FileText,
  LayoutDashboard,
  Mail
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SavedParts from "@/components/buyer/SavedParts";
import MyOrders from "@/components/buyer/MyOrders";
import BuyerProfile from "@/components/buyer/BuyerProfile";
import BuyerNotifications from "@/components/buyer/BuyerNotifications";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import { useIsMobile } from "@/hooks/use-mobile";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="pt-16 pb-20 px-4 space-y-6">
          {/* Mobile Welcome Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{t('welcomeBack')}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-sm">{t('rateSellers')}</h3>
              <p className="text-xs text-gray-500">{t('rateCompletedOrders')}</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-medium text-sm">{t('notifications')}</h3>
              <p className="text-xs text-gray-500">{t('latestAlerts')}</p>
            </Card>
          </div>

          {/* Mobile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" className="text-xs">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                {t('overview')}
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs">
                <Star className="w-4 h-4 mr-1" />
                {t('saved')}
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs">
                <FileText className="w-4 h-4 mr-1" />
                {t('orders')}
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs">
                <User className="w-4 h-4 mr-1" />
                {t('profile')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{t('recentActivity')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{t('noRecentActivity')}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <SavedParts />
            </TabsContent>

            <TabsContent value="orders">
              <MyOrders />
            </TabsContent>

            <TabsContent value="profile">
              <BuyerProfile />
            </TabsContent>
          </Tabs>
        </div>
        <MobileBottomTabs />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Desktop Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-header text-blue-600">{t('buyerDashboard')}</h1>
              <p className="text-gray-600 mt-1">{t('welcomeBack')}, {user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t('chatWithSeller')}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {t('viewPart')}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('rateSellers')}</h3>
                  <p className="text-sm text-gray-600">{t('rateCompletedOrders')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('notifications')}</h3>
                  <p className="text-sm text-gray-600">{t('latestAlerts')}</p>
                  <Badge variant="secondary" className="mt-1">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('profileSettings')}</h3>
                  <p className="text-sm text-gray-600">{t('editYourProfile')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('searchParts')}</h3>
                  <p className="text-sm text-gray-600">{t('findWhatYouNeed')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">{t('overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">{t('savedParts')}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{t('myOrders')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t('profile')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {t('recentActivity')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{t('noRecentActivity')}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      {t('searchParts')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      {t('requestPart')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t('viewMessages')}
                    </Button>
                  </CardContent>
                </Card>

                <BuyerNotifications />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <SavedParts />
          </TabsContent>

          <TabsContent value="orders">
            <MyOrders />
          </TabsContent>

          <TabsContent value="profile">
            <BuyerProfile />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
