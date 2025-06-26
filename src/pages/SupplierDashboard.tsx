
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

  // Stats
  const [stats, setStats] = useState({
    totalOffers: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
  });

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchMyOffers();
    }
  }, [user]);

  useEffect(() => {
    // Calculate stats whenever offers change
    const totalOffers = myOffers.length;
    const pendingOffers = myOffers.filter(offer => offer.status === 'pending').length;
    const acceptedOffers = myOffers.filter(offer => offer.status === 'accepted').length;
    
    setStats({ totalOffers, pendingOffers, acceptedOffers });
  }, [myOffers]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('part_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchMyOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:part_requests(id, car_make, car_model, car_year, part_needed, phone, location)
        `)
        .eq('supplier_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "Error",
        description: "Failed to load your offers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (requestId: string, price: number, message: string, location: string) => {
    setSubmittingOffer(requestId);

    try {
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
      console.error('Error making offer:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <SupplierHeader />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
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
      </main>
    </div>
  );
};

export default SupplierDashboard;
