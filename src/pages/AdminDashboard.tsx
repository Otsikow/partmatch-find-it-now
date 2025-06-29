import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminStats from "@/components/admin/AdminStats";
import RequestCard from "@/components/admin/RequestCard";
import OfferCard from "@/components/admin/OfferCard";
import VerificationCard from "@/components/admin/VerificationCard";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

interface SellerVerification {
  id: string;
  user_id: string;
  full_name: string;
  seller_type: string;
  business_name?: string;
  business_address: string;
  phone: string;
  email: string;
  date_of_birth: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
  government_id_url?: string;
  business_registration_url?: string;
  proof_of_address_url?: string;
  profile_photo_url?: string;
  business_location_photo_url?: string;
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
        supplier: offer.profiles ? `${offer.profiles.first_name || ''} ${offer.profiles.last_name || ''}`.trim() : 'Unknown Seller',
        price: `GHS ${offer.price}`,
        phone: offer.profiles?.phone || '',
        status: offer.status
      }));

      // Transform verifications data with proper type casting
      const transformedVerifications: SellerVerification[] = (verificationsData || []).map(verification => ({
        ...verification,
        verification_status: verification.verification_status as 'pending' | 'approved' | 'rejected'
      }));

      setRequests(transformedRequests);
      setOffers(transformedOffers);
      setVerifications(transformedVerifications);
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

  const handleMatchSupplier = async (requestId: string) => {
    try {
      console.log('Accepting offer for request:', requestId);
      
      // Find the related offer
      const relatedOffer = offers.find(o => o.requestId === requestId);
      if (!relatedOffer) {
        toast({
          title: "Error",
          description: "No offer found for this request.",
          variant: "destructive"
        });
        return;
      }

      console.log('Found related offer:', relatedOffer.id);

      // Update offer status to accepted and unlock contact
      const { error: offerError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          contact_unlocked: true
        })
        .eq('id', relatedOffer.id);

      if (offerError) {
        console.error('Error updating offer:', offerError);
        throw offerError;
      }

      // Update request status to matched (offer_received in database)
      const { error: requestError } = await supabase
        .from('part_requests')
        .update({ status: 'offer_received' })
        .eq('id', requestId);

      if (requestError) {
        console.error('Error updating request:', requestError);
        throw requestError;
      }

      console.log('Successfully updated offer and request status');

      // Refresh data to show updated status
      await fetchData();
      
      toast({
        title: "Offer Accepted!",
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
      console.log('Completing request:', requestId);
      
      const { error } = await supabase
        .from('part_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) {
        console.error('Error completing request:', error);
        throw error;
      }

      console.log('Successfully completed request');

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
      console.log(`${action === 'approve' ? 'Approving' : 'Rejecting'} verification:`, verificationId);
      
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('seller_verifications')
        .update({ 
          verification_status: status,
          admin_notes: notes || null,
          verified_at: action === 'approve' ? new Date().toISOString() : null,
          verified_by: action === 'approve' ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', verificationId);

      if (error) {
        console.error('Error updating verification:', error);
        throw error;
      }

      console.log('Successfully updated verification status');

      // If approving, also update the user's profile to mark them as verified
      if (action === 'approve') {
        const verification = verifications.find(v => v.id === verificationId);
        if (verification) {
          console.log('Updating user profile to verified:', verification.user_id);
          
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              is_verified: true,
              verified_at: new Date().toISOString()
            })
            .eq('id', verification.user_id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
            throw profileError;
          }
          
          console.log('Successfully updated user profile');
        }
      }

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
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "Document URL not found.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Creating signed URL for document:', documentUrl);
      
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .createSignedUrl(documentUrl, 3600); // 1 hour expiry
        
      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }
        
      if (data?.signedUrl) {
        console.log('Opening document:', data.signedUrl);
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error('Failed to generate signed URL');
      }
    } catch (error: any) {
      console.error('Error creating signed URL:', error);
      toast({
        title: "Error",
        description: "Failed to load document.",
        variant: "destructive"
      });
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
      <header className="p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          </div>
        </div>
        
        {/* Admin Notification Bell */}
        <div className="flex items-center gap-2">
          <AdminNotificationBell />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <AdminStats
          pendingRequests={requests.filter(r => r.status === 'pending').length}
          matchedRequests={requests.filter(r => r.status === 'matched').length}
          completedRequests={requests.filter(r => r.status === 'completed').length}
          totalRequests={requests.length}
          pendingVerifications={verifications.filter(v => v.verification_status === 'pending').length}
        />

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm">
            <TabsTrigger value="requests" className="text-base font-inter">All Requests</TabsTrigger>
            <TabsTrigger value="offers" className="text-base font-inter">Seller Offers</TabsTrigger>
            <TabsTrigger value="verifications" className="text-base font-inter">Seller Verifications</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Customer Requests</h2>
              
              {requests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onMatchSupplier={handleMatchSupplier}
                  onCompleteRequest={handleCompleteRequest}
                  hasRelatedOffer={offers.some(o => o.requestId === request.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Seller Offers</h2>
              
              {offers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  relatedRequest={requests.find(r => r.id === offer.requestId)}
                  onAcceptOffer={handleMatchSupplier}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Seller Verifications
              </h2>
              
              {verifications.length === 0 ? (
                <Card className="p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30">
                  <div className="text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Verification Requests</h3>
                    <p className="text-sm">There are currently no seller verification requests to review.</p>
                  </div>
                </Card>
              ) : (
                verifications.map(verification => (
                  <VerificationCard
                    key={verification.id}
                    verification={verification}
                    onApprove={(id) => handleVerificationAction(id, 'approve')}
                    onReject={handleVerificationAction}
                    onViewDocument={viewDocument}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
