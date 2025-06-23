
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Plus, MapPin, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import LocationSelector from "@/components/LocationSelector";

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
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
  };
}

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Offer form state
  const [showOfferForm, setShowOfferForm] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLocation, setOfferLocation] = useState('');

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchMyOffers();
    }
  }, [user]);

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
    }
  };

  const fetchMyOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:part_requests(id, car_make, car_model, car_year, part_needed)
        `)
        .eq('supplier_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (requestId: string) => {
    if (!offerPrice || !offerLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in price and location.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('offers')
        .insert({
          request_id: requestId,
          supplier_id: user?.id,
          price: parseFloat(offerPrice),
          message: offerMessage,
          contact_unlock_fee: 5.00 // Default unlock fee
        });

      if (error) throw error;

      toast({
        title: "Offer Sent!",
        description: "The customer will be notified of your offer.",
      });

      // Reset form
      setShowOfferForm(null);
      setOfferPrice('');
      setOfferMessage('');
      setOfferLocation('');

      // Refresh offers
      fetchMyOffers();
    } catch (error: any) {
      console.error('Error making offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit offer.",
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppContact = (phone: string, request: Request) => {
    const message = `Hi! I have the ${request.part_needed} for your ${request.car_make} ${request.car_model} ${request.car_year}. Let's discuss!`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-orange-600" />
          <h1 className="text-xl font-bold">Supplier Dashboard</h1>
          <VerifiedBadge isVerified={true} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Part Requests</TabsTrigger>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customer Requests</h2>
              
              {requests.map(request => (
                <Card key={request.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.car_make} {request.car_model} {request.car_year}
                      </h3>
                      <p className="text-gray-600">Part: {request.part_needed}</p>
                      {request.description && (
                        <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {request.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {request.phone}
                    </div>
                  </div>

                  {showOfferForm === request.id ? (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Your Price (GHS)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 150"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                          />
                        </div>
                        <div>
                          <LocationSelector
                            value={offerLocation}
                            onChange={setOfferLocation}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Message (Optional)</Label>
                        <Input
                          placeholder="Additional details about the part..."
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleMakeOffer(request.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Submit Offer
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowOfferForm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setShowOfferForm(request.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        I Have This Part!
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleWhatsAppContact(request.phone, request)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  )}
                </Card>
              ))}

              {requests.length === 0 && (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                  <p className="text-gray-600">Check back later for new part requests</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Offers</h2>

              {myOffers.map(offer => (
                <Card key={offer.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {offer.request.car_make} {offer.request.car_model} {offer.request.car_year}
                      </h3>
                      <p className="text-gray-600">Part: {offer.request.part_needed}</p>
                      {offer.message && (
                        <p className="text-sm text-gray-500 mt-1">"{offer.message}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">GHS {offer.price}</p>
                      <Badge variant={offer.status === 'pending' ? 'outline' : 'default'}>
                        {offer.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(offer.created_at).toLocaleDateString()}
                  </p>
                </Card>
              ))}

              {myOffers.length === 0 && (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
                  <p className="text-gray-600">Start making offers on customer requests</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplierDashboard;
