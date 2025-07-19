
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, DollarSign, Truck, ExternalLink, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const navigate = useNavigate();
  
  const orders = [
    {
      id: '1',
      partName: 'Brake pads',
      carModel: 'Toyota Camry 2020',
      seller: 'AutoParts Plus',
      sellerId: 'seller_1',
      price: 'GHS 45.99',
      status: 'Delivered',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '2',
      partName: 'Oil filter',
      carModel: 'Honda Civic 2019',
      seller: 'Quick Parts',
      sellerId: 'seller_2',
      price: 'GHS 12.50',
      status: 'In transit',
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-22',
      trackingNumber: 'TRK987654321'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackOrder = (order: any) => {
    // For now, show tracking information in a toast
    // In a real app, this could open a tracking modal or navigate to a tracking page
    toast({
      title: "Order Tracking",
      description: `Tracking number: ${order.trackingNumber}\nStatus: ${order.status}\nExpected delivery: ${order.deliveryDate}`,
    });
  };

  const handleContactSeller = (order: any) => {
    // Navigate to chat with the seller
    // In a real app, you'd want to create or find an existing chat with this seller
    toast({
      title: "Contact Seller",
      description: `Opening chat with ${order.seller}...`,
    });
    
    // For now, navigate to chat page - in real app, you'd want to create/find chat with this specific seller
    navigate('/chat');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">My orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button>Browse parts</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {order.partName}
                  </CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{order.carModel}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    {/* <DollarSign className="h-4 w-4 text-gray-400" /> */}
                    <span className="text-sm font-medium">{order.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Ordered: {order.orderDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Delivery: {order.deliveryDate}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Seller: {order.seller}</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTrackOrder(order)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Track order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactSeller(order)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Contact seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
