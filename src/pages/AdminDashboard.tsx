import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Package, CheckCircle, Clock, MapPin, Phone, Shield, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SellerVerification {
  id: string;
  user_id: string;
  full_name: string;
  seller_type: string;
  business_name?: string;
  business_address: string;
  phone: string;
  email: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
  government_id_url?: string;
  business_registration_url?: string;
  proof_of_address_url?: string;
}

interface Request {
  id: string;
  make: string;
  model: string;
  year: string;
  part: string;
  customer: string;
  location: string;
  phone: string;
  status: 'pending' | 'matched' | 'completed';
  timestamp: string;
}

interface Offer {
  id: string;
  requestId: string;
  supplier: string;
  price: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [verifications, setVerifications] = useState<SellerVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch real requests from database
      const { data: requestsData, error: requestsError } = await supabase
        .from('part_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch real offers from database
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          *,
          part_requests!request_id(car_make, car_model, car_year, part_needed),
          profiles!supplier_id(first_name, last_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      // Fetch seller verifications
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('seller_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (verificationsError) throw verificationsError;

      // Transform requests data
      const transformedRequests: Request[] = (requestsData || []).map(req => ({
        id: req.id,
        make: req.car_make,
        model: req.car_model,
        year: req.car_year.toString(),
        part: req.part_needed,
        customer: 'Customer', // You might want to join with profiles table for actual name
        location: req.location,
        phone: req.phone,
        status: req.status === 'pending' ? 'pending' : req.status === 'offer_received' ? 'matched' : 'completed',
        timestamp: new Date(req.created_at).toLocaleString()
      }));

      // Transform offers data
      const transformedOffers: Offer[] = (offersData || []).map(offer => ({
        id: offer.id,
        requestId: offer.request_id,
        supplier: offer.profiles ? `${offer.profiles.first_name || ''} ${offer.profiles.last_name || ''}`.trim() : 'Unknown Supplier',
        price: `GHS ${offer.price}`,
        phone: offer.profiles?.phone || '',
        status: offer.status
      }));

      setRequests(transformedRequests);
      setOffers(transformedOffers);
      setVerifications(verificationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSupplier = async (requestId: string, offerId: string) => {
    try {
      // Update offer status to accepted
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      // Update request status
      const { error: requestError } = await supabase
        .from('part_requests')
        .update({ status: 'offer_received' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Refresh data to show updated status
      await fetchData();
      
      toast({
        title: "Match Created!",
        description: "The offer has been accepted and both parties have been notified.",
      });
    } catch (error: any) {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('part_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) throw error;

      // Refresh data
      await fetchData();
      
      toast({
        title: "Request Completed!",
        description: "The transaction has been marked as complete.",
      });
    } catch (error: any) {
      console.error('Error completing request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVerificationAction = async (verificationId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('seller_verifications')
        .update({ 
          verification_status: status,
          admin_notes: notes || null,
          verified_at: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', verificationId);

      if (error) throw error;

      // Refresh data
      await fetchData();
      
      toast({
        title: `Verification ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        description: `The seller verification has been ${status}.`,
      });
    } catch (error: any) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update verification. Please try again.",
        variant: "destructive"
      });
    }
  };

  const viewDocument = async (documentUrl: string) => {
    if (!documentUrl) return;
    
    try {
      const { data } = await supabase.storage
        .from('verification-documents')
        .createSignedUrl(documentUrl, 3600); // 1 hour expiry
        
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error creating signed URL:', error);
      toast({
        title: "Error",
        description: "Failed to load document.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'matched': return <Users className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Updated Stats to include verifications */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Pending Requests</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'matched').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Matched</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Completed</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">{requests.length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Requests</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-indigo-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              {verifications.filter(v => v.verification_status === 'pending').length}
            </p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Pending Verifications</p>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm">
            <TabsTrigger value="requests" className="text-base font-inter">All Requests</TabsTrigger>
            <TabsTrigger value="offers" className="text-base font-inter">Supplier Offers</TabsTrigger>
            <TabsTrigger value="verifications" className="text-base font-inter">Seller Verifications</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Customer Requests</h2>
              
              {requests.map(request => (
                <Card key={request.id} className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h3 className="font-playfair font-semibold text-lg sm:text-xl">
                        {request.make} {request.model} {request.year}
                      </h3>
                      <p className="text-gray-600 font-crimson text-base sm:text-lg">Part: {request.part}</p>
                      <p className="text-sm sm:text-base text-gray-500 font-inter">Customer: {request.customer}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 text-sm sm:text-base`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-inter">{request.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {request.phone}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {request.status === 'pending' && (
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                          const relatedOffer = offers.find(o => o.requestId === request.id);
                          if (relatedOffer) {
                            handleMatchSupplier(request.id, relatedOffer.id);
                          }
                        }}
                      >
                        Match with Supplier
                      </Button>
                    )}
                    {request.status === 'matched' && (
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${request.phone}`, '_self')}
                      className="text-base border-purple-200 hover:bg-purple-50"
                    >
                      Call Customer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Supplier Offers</h2>
              
              {offers.map(offer => {
                const relatedRequest = requests.find(r => r.id === offer.requestId);
                return (
                  <Card key={offer.id} className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div>
                        <h3 className="font-playfair font-semibold text-lg sm:text-xl">
                          {relatedRequest?.make} {relatedRequest?.model} - {relatedRequest?.part}
                        </h3>
                        <p className="text-gray-600 font-crimson text-base sm:text-lg">Supplier: {offer.supplier}</p>
                        <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{offer.price}</p>
                      </div>
                      <Badge className={`${getStatusColor(offer.status)} text-sm sm:text-base`}>
                        {offer.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {offer.phone}
                      </div>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleMatchSupplier(offer.requestId, offer.id)}
                        >
                          Accept Offer
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`tel:${offer.phone}`, '_self')}
                          className="text-base border-purple-200 hover:bg-purple-50"
                        >
                          Call Supplier
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Seller Verifications
              </h2>
              
              {verifications.map(verification => (
                <Card key={verification.id} className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h3 className="font-playfair font-semibold text-lg sm:text-xl">
                        {verification.business_name || verification.full_name}
                      </h3>
                      <p className="text-gray-600 font-crimson text-base sm:text-lg">
                        {verification.seller_type} - {verification.full_name}
                      </p>
                      <p className="text-sm sm:text-base text-gray-500 font-inter">
                        Email: {verification.email} | Phone: {verification.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(verification.verification_status)} flex items-center gap-1 text-sm sm:text-base`}>
                        {getStatusIcon(verification.verification_status)}
                        {verification.verification_status}
                      </Badge>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-inter">
                        {new Date(verification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-gray-600 font-crimson">
                      <strong>Address:</strong> {verification.business_address}
                    </p>
                    {verification.admin_notes && (
                      <p className="text-sm sm:text-base text-gray-600 font-crimson mt-2">
                        <strong>Admin Notes:</strong> {verification.admin_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {verification.government_id_url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => viewDocument(verification.government_id_url!)}
                        className="text-base border-purple-200 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View ID
                      </Button>
                    )}
                    {verification.business_registration_url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => viewDocument(verification.business_registration_url!)}
                        className="text-base border-purple-200 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Registration
                      </Button>
                    )}
                    {verification.proof_of_address_url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => viewDocument(verification.proof_of_address_url!)}
                        className="text-base border-purple-200 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Address Proof
                      </Button>
                    )}
                  </div>

                  {verification.verification_status === 'pending' && (
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleVerificationAction(verification.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        className="text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                          const notes = prompt('Enter rejection reason:');
                          if (notes) {
                            handleVerificationAction(verification.id, 'reject', notes);
                          }
                        }}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${verification.phone}`, '_self')}
                        className="text-base border-purple-200 hover:bg-purple-50"
                      >
                        Call Seller
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
