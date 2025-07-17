
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  MapPin,
  Truck
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

const MyOrders = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const isMobile = useIsMobile();

  // Mock data - replace with actual API call
  const orders = [
    {
      id: "ORD-001",
      partTitle: "Toyota Camry Brake Pads",
      sellerName: "AutoParts Ghana",
      price: 450,
      currency: "GHS",
      status: "delivered",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-20",
      location: "Accra, Ghana",
      image: "/placeholder.svg",
      rated: false,
    },
    {
      id: "ORD-002", 
      partTitle: "Honda Civic Headlight Assembly",
      sellerName: "Parts Plus",
      price: 680,
      currency: "GHS",
      status: "shipped",
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-22",
      location: "Kumasi, Ghana",
      image: "/placeholder.svg",
      rated: false,
    },
    {
      id: "ORD-003",
      partTitle: "Nissan Sentra Air Filter",
      sellerName: "Quality Auto Parts",
      price: 120,
      currency: "GHS", 
      status: "pending",
      orderDate: "2024-01-20",
      deliveryDate: null,
      location: "Takoradi, Ghana",
      image: "/placeholder.svg",
      rated: false,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.partTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === "all" || order.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{t('myOrders')}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredOrders.length} {t('orders')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('searchOrders')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="all" className="text-xs">
            {t('all')} ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            {t('pending')} ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="text-xs">
            {t('shipped')} ({statusCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs">
            {t('delivered')} ({statusCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs lg:inline hidden">
            {t('cancelled')} ({statusCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="space-y-4">
          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Order Image */}
                      <div className="w-full lg:w-20 h-48 lg:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                              {order.partTitle}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('seller')}: {order.sellerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t('orderNumber')}: {order.id}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {t(order.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {t('ordered')}: {order.orderDate}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{order.location}</span>
                          </div>
                          
                          <div className="text-lg font-bold text-primary">
                            {order.currency} {order.price?.toLocaleString()}
                          </div>

                          {order.deliveryDate && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {t('delivered')}: {order.deliveryDate}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {t('viewDetails')}
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {t('contactSeller')}
                          </Button>
                          {order.status === "delivered" && !order.rated && (
                            <Button size="sm" className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              {t('rateSeller')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? t('noOrdersFound') : t('noOrders')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? t('tryDifferentSearch') 
                    : t('startShopping')
                  }
                </p>
                <Button asChild>
                  <a href="/search-parts">{t('browseParts')}</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyOrders;
