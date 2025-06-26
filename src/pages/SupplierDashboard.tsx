
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package, MapPin, Phone, MessageCircle, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
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

  // Offer form state
  const [showOfferForm, setShowOfferForm] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLocation, setOfferLocation] = useState('');

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

  const handleMakeOffer = async (requestId: string) => {
    if (!offerPrice || !offerLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in price and location.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(offerPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setSubmittingOffer(requestId);

    try {
      const { error } = await supabase
        .from('offers')
        .insert({
          request_id: requestId,
          supplier_id: user?.id,
          price: price,
          message: offerMessage || null,
          contact_unlock_fee: 5.00
        });

      if (error) throw error;

      toast({
        title: "Offer Submitted!",
        description: "Your offer has been sent to the customer.",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-orange-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-600 flex-shrink-0" />
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent truncate">Supplier Dashboard</h1>
          <VerifiedBadge isVerified={true} className="hidden sm:flex" />
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Offers</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.totalOffers}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.pendingOffers}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Accepted</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.acceptedOffers}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="requests" className="text-sm sm:text-base">Customer Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="offers" className="text-sm sm:text-base">My Offers ({myOffers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-0">
            <div className="space-y-4 sm:space-y-6">
              {requests.map(request => (
                <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                          {request.car_make} {request.car_model} {request.car_year}
                        </CardTitle>
                        <p className="text-orange-600 font-semibold text-base sm:text-lg mt-1">
                          Part: {request.part_needed}
                        </p>
                        {request.description && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            {request.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                        Active Request
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                    </div>

                    {showOfferForm === request.id ? (
                      <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800">Submit Your Offer</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`price-${request.id}`} className="text-sm font-medium">Your Price (GHS) *</Label>
                            <Input
                              id={`price-${request.id}`}
                              type="number"
                              placeholder="e.g. 150"
                              value={offerPrice}
                              onChange={(e) => setOfferPrice(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Your Location *</Label>
                            <div className="mt-1">
                              <LocationSelector
                                value={offerLocation}
                                onChange={setOfferLocation}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`message-${request.id}`} className="text-sm font-medium">Additional Message (Optional)</Label>
                          <Textarea
                            id={`message-${request.id}`}
                            placeholder="Describe the condition, warranty, or any other details..."
                            value={offerMessage}
                            onChange={(e) => setOfferMessage(e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={() => handleMakeOffer(request.id)}
                            disabled={submittingOffer === request.id}
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                          >
                            {submittingOffer === request.id ? "Submitting..." : "Submit Offer"}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowOfferForm(null)}
                            disabled={submittingOffer === request.id}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={() => setShowOfferForm(request.id)}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-sm sm:text-base"
                        >
                          I Have This Part!
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleWhatsAppContact(request.phone, request)}
                          className="bg-green-600 hover:bg-green-700 text-white border-green-600 text-sm sm:text-base"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {requests.length === 0 && (
                <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No active requests</h3>
                  <p className="text-gray-600 text-base sm:text-lg">Check back later for new part requests from customers</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-0">
            <div className="space-y-4 sm:space-y-6">
              {myOffers.map(offer => (
                <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                          {offer.request.car_make} {offer.request.car_model} {offer.request.car_year}
                        </CardTitle>
                        <p className="text-orange-600 font-semibold text-base sm:text-lg mt-1">
                          Part: {offer.request.part_needed}
                        </p>
                        {offer.message && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            "{offer.message}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <p className="text-xl sm:text-2xl font-bold text-green-600">GHS {offer.price}</p>
                        {getStatusBadge(offer.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{offer.request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>Submitted: {formatDate(offer.created_at)}</span>
                      </div>
                      {offer.contact_unlocked && (
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">Contact Unlocked</span>
                        </div>
                      )}
                    </div>

                    {offer.status === 'accepted' && offer.contact_unlocked && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 font-medium mb-2">🎉 Congratulations! Your offer was accepted.</p>
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Phone className="h-4 w-4" />
                          <span>Customer phone: {offer.request.phone}</span>
                        </div>
                      </div>
                    )}

                    {(offer.status === 'accepted' || offer.contact_unlocked) && (
                      <Button
                        onClick={() => handleWhatsAppContact(offer.request.phone, offer.request)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Customer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {myOffers.length === 0 && (
                <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No offers yet</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
                    Start making offers on customer requests to grow your business
                  </p>
                  <Button 
                    onClick={() => setActiveTab('requests')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    View Customer Requests
                  </Button>
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
