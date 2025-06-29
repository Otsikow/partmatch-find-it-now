
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import SupplierHeader from "@/components/SupplierHeader";
import SupplierStats from "@/components/SupplierStats";
import SupplierTabs from "@/components/SupplierTabs";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  contact_unlocked: boolean;
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    phone: string;
    location: string;
  };
}

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingOffer, setSubmittingOffer] = useState<string | null>(null);
  const [showMainDashboard, setShowMainDashboard] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalOffers: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
  });

  useEffect(() => {
    if (user) {
      console.log('SupplierDashboard: User found, fetching data for:', user.id);
      fetchData();
    } else {
      console.log('SupplierDashboard: No user found');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Calculate stats whenever offers change
    const totalOffers = myOffers.length;
    const pendingOffers = myOffers.filter(offer => offer.status === 'pending').length;
    const acceptedOffers = myOffers.filter(offer => offer.status === 'accepted').length;
    
    setStats({ totalOffers, pendingOffers, acceptedOffers });
  }, [myOffers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('SupplierDashboard: Starting data fetch');
      
      // Fetch both requests and offers in parallel
      const [requestsResult, offersResult] = await Promise.allSettled([
        fetchRequests(),
        fetchMyOffers()
      ]);

      if (requestsResult.status === 'rejected') {
        console.error('SupplierDashboard: Failed to fetch requests:', requestsResult.reason);
      }

      if (offersResult.status === 'rejected') {
        console.error('SupplierDashboard: Failed to fetch offers:', offersResult.reason);
      }

      // If both failed, show error
      if (requestsResult.status === 'rejected' && offersResult.status === 'rejected') {
        setError('Failed to load dashboard data. Please try again.');
      }

    } catch (error) {
      console.error('SupplierDashboard: Unexpected error in fetchData:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
      console.log('SupplierDashboard: Data fetch completed');
    }
  };

  const fetchRequests = async () => {
    try {
      console.log('SupplierDashboard: Fetching requests');
      const { data, error } = await supabase
        .from('part_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SupplierDashboard: Error fetching requests:', error);
        throw error;
      }

      console.log('SupplierDashboard: Fetched requests:', data?.length || 0);
      setRequests(data || []);
      return data;
    } catch (error) {
      console.error('SupplierDashboard: Request fetch failed:', error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const fetchMyOffers = async () => {
    try {
      console.log('SupplierDashboard: Fetching offers for user:', user?.id);
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:part_requests(id, car_make, car_model, car_year, part_needed, phone, location)
        `)
        .eq('supplier_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SupplierDashboard: Error fetching offers:', error);
        throw error;
      }
      
      console.log('SupplierDashboard: Fetched offers:', data?.length || 0);
      setMyOffers(data || []);
      return data;
    } catch (error) {
      console.error('SupplierDashboard: Offers fetch failed:', error);
      toast({
        title: "Error",
        description: "Failed to load your offers. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Set up real-time subscription for offer updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('SupplierDashboard: Setting up realtime subscription for user:', user.id);
    const channel = supabase
      .channel('offer-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `supplier_id=eq.${user.id}`
        },
        (payload) => {
          console.log('SupplierDashboard: Offer updated via realtime:', payload);
          fetchMyOffers(); // Refresh offers when status changes
        }
      )
      .subscribe();

    return () => {
      console.log('SupplierDashboard: Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleMakeOffer = async (requestId: string, price: number, message: string, location: string) => {
    setSubmittingOffer(requestId);

    try {
      console.log('SupplierDashboard: Submitting offer for request:', requestId);
      const { error } = await supabase
        .from('offers')
        .insert({
          request_id: requestId,
          supplier_id: user?.id,
          price: price,
          message: message || null,
          contact_unlock_fee: 5.00
        });

      if (error) throw error;

      toast({
        title: "Offer Submitted!",
        description: "Your offer has been sent to the customer.",
      });

      // Refresh offers
      fetchMyOffers();
    } catch (error: any) {
      console.error('SupplierDashboard: Error making offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingOffer(null);
    }
  };

  const handleWhatsAppContact = (phone: string, request: Request | Offer['request']) => {
    const message = `Hi! I have the ${request.part_needed} for your ${request.car_make} ${request.car_model} ${request.car_year}. Let's discuss!`;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRetry = () => {
    console.log('SupplierDashboard: Retrying data fetch');
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-fit mx-auto mb-4">
            <Package className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleRetry} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <SupplierHeader />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
        {showMainDashboard ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
                <Package className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-4 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                Seller Dashboard
              </h2>
              <p className="text-gray-600 text-lg font-crimson">
                What would you like to do?
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              {/* Sell Car Parts */}
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-orange-700">
                    Sell Car Parts
                  </h3>
                  <p className="text-gray-600 mb-6 font-crimson">
                    Manage your inventory, offers, and customer requests
                  </p>
                  <Button 
                    onClick={() => setShowMainDashboard(false)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Seller Tools
                  </Button>
                </CardContent>
              </Card>

              {/* Browse Car Parts */}
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-emerald-700">
                    Browse Car Parts
                  </h3>
                  <p className="text-gray-600 mb-6 font-crimson">
                    Search through available car parts from other sellers
                  </p>
                  <Link to="/search">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Browsing
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Request Car Parts */}
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-blue-700">
                    Request Car Parts
                  </h3>
                  <p className="text-gray-600 mb-6 font-crimson">
                    Can't find what you need? Request it and other sellers will reach out
                  </p>
                  <Link to="/request">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Make Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowMainDashboard(true)}
                className="flex items-center gap-2 hover:bg-orange-50"
              >
                ← Back to Dashboard
              </Button>
            </div>

            <SupplierStats
              totalOffers={stats.totalOffers}
              pendingOffers={stats.pendingOffers}
              acceptedOffers={stats.acceptedOffers}
            />

            <SupplierTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              requests={requests}
              offers={myOffers}
              onOfferSubmit={handleMakeOffer}
              onWhatsAppContact={handleWhatsAppContact}
              isSubmittingOffer={submittingOffer !== null}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;
