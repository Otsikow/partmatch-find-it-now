
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, MessageCircle, Star, Eye, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import ChatButton from '@/components/chat/ChatButton';
import RatingModal from '@/components/RatingModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  part?: {
    title: string;
    make: string;
    model: string;
    year: number;
    images?: string[];
  };
  seller?: {
    first_name?: string;
    last_name?: string;
    id: string;
  };
  seller_id: string;
  has_rated?: boolean;
}

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    offerId: string;
    sellerId: string;
    sellerName: string;
  }>({
    isOpen: false,
    offerId: '',
    sellerId: '',
    sellerName: ''
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data: offers, error } = await supabase
        .from('offers')
        .select(`
          id,
          created_at,
          status,
          price,
          supplier_id,
          transaction_completed,
          part_requests!inner(
            car_make,
            car_model,
            car_year,
            part_needed
          ),
          profiles!supplier_id(
            first_name,
            last_name
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which orders have been rated
      const ordersWithRating = await Promise.all(
        (offers || []).map(async (offer: any) => {
          const { data: review } = await supabase
            .from('reviews')
            .select('id')
            .eq('offer_id', offer.id)
            .eq('reviewer_id', user.id)
            .maybeSingle();

          return {
            id: offer.id,
            created_at: offer.created_at,
            status: offer.transaction_completed ? 'completed' : offer.status,
            total_amount: offer.price,
            currency: 'GHS',
            part: {
              title: offer.part_requests?.part_needed || 'Car Part',
              make: offer.part_requests?.car_make || '',
              model: offer.part_requests?.car_model || '',
              year: offer.part_requests?.car_year || 0,
            },
            seller: offer.profiles,
            seller_id: offer.supplier_id,
            has_rated: !!review
          };
        })
      );

      setOrders(ordersWithRating);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.part?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${order.part?.make} ${order.part?.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRateClick = (order: Order) => {
    const sellerName = order.seller 
      ? `${order.seller.first_name || ''} ${order.seller.last_name || ''}`.trim() || 'Seller'
      : 'Seller';
    
    setRatingModal({
      isOpen: true,
      offerId: order.id,
      sellerId: order.seller_id,
      sellerName
    });
  };

  const handleRatingSubmitted = () => {
    setRatingModal({ isOpen: false, offerId: '', sellerId: '', sellerName: '' });
    fetchOrders(); // Refresh to update rating status
  };

  const handleStartShopping = () => {
    navigate('/search-parts');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            <p className="text-gray-600 mt-1">Track and manage your purchases</p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-gray-200">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600 mt-1">Track and manage your purchases</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Start shopping to see your orders here. Browse our marketplace to find the car parts you need.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                onClick={handleStartShopping}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-all duration-200 border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                  {/* Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {order.part?.title}
                        </h3>
                        <p className="text-gray-600">
                          {order.part?.make} {order.part?.model} ({order.part?.year})
                        </p>
                        <p className="text-sm text-gray-500">
                          Seller: {order.seller 
                            ? `${order.seller.first_name || ''} ${order.seller.last_name || ''}`.trim() || 'Unknown'
                            : 'Unknown'
                          }
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} px-3 py-1`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="font-semibold text-green-600 text-lg">
                        {order.currency} {order.total_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row xl:flex-col gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-gray-50">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    <ChatButton
                      sellerId={order.seller_id}
                      partId={undefined}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-blue-50"
                    />
                    
                    {order.status === 'completed' && !order.has_rated && (
                      <Button 
                        onClick={() => handleRateClick(order)}
                        size="sm" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
                      >
                        <Star className="h-4 w-4" />
                        Rate Seller
                      </Button>
                    )}
                    
                    {order.has_rated && (
                      <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        Rated
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, offerId: '', sellerId: '', sellerName: '' })}
        offerId={ratingModal.offerId}
        sellerId={ratingModal.sellerId}
        sellerName={ratingModal.sellerName}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default MyOrders;
