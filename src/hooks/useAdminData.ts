
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  ownerId?: string; // Add owner ID for chat functionality
}

interface Offer {
  id: string;
  requestId: string;
  supplier: string;
  price: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  transaction_completed?: boolean;
  buyer_id?: string;
  supplierId?: string; // Add supplier ID for chat functionality
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  user_type: 'owner' | 'supplier' | 'admin';
  is_verified: boolean;
  is_blocked: boolean;
  created_at: string;
  rating?: number;
  total_ratings?: number;
  email?: string;
}

export const useAdminData = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [verifications, setVerifications] = useState<SellerVerification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log('🔧 ADMIN DEBUG: Starting fetchData...');
      setLoading(true);
      
      // Check current user authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔧 ADMIN DEBUG: Current user:', user?.email, 'ID:', user?.id);
      
      if (userError) {
        console.error('🔧 ADMIN DEBUG: Auth error:', userError);
        throw userError;
      }
      
      // Fetch real requests from database
      const { data: requestsData, error: requestsError } = await supabase
        .from('part_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        throw requestsError;
      }

      // Fetch real offers from database with new transaction fields
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          *,
          part_requests!request_id(car_make, car_model, car_year, part_needed),
          profiles!supplier_id(first_name, last_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.error('Error fetching offers:', offersError);
        throw offersError;
      }

      // Fetch seller verifications (only for suppliers)
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('seller_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (verificationsError) {
        console.error('Error fetching verifications:', verificationsError);
        throw verificationsError;
      }

      // Fetch users from profiles table - buyers are now auto-verified
      console.log('Fetching users from profiles...');
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      console.log('Raw users data:', usersData?.length || 0, 'users fetched');
      console.log('Sample user data:', usersData?.slice(0, 3).map(u => ({ 
        id: u.id.slice(0, 8), 
        user_type: u.user_type, 
        is_verified: u.is_verified, 
        is_blocked: u.is_blocked 
      })));

      // Transform users data - buyers are auto-verified, only suppliers need manual verification
      const transformedUsers: UserProfile[] = (usersData || []).map(user => ({
        ...user,
        email: `user-${user.id.slice(0, 8)}@system.local`,
        user_type: user.user_type as 'owner' | 'supplier' | 'admin'
      }));

      console.log('Transformed users:', transformedUsers.length);
      console.log('User types breakdown:', {
        suppliers: transformedUsers.filter(u => u.user_type === 'supplier').length,
        owners: transformedUsers.filter(u => u.user_type === 'owner').length,
        admins: transformedUsers.filter(u => u.user_type === 'admin').length
      });

      // Log detailed statistics - note buyers are now auto-verified
      const userStats = {
        total: transformedUsers.length,
        admins: transformedUsers.filter(u => u.user_type === 'admin').length,
        sellers: transformedUsers.filter(u => u.user_type === 'supplier').length,
        buyers: transformedUsers.filter(u => u.user_type === 'owner').length,
        verified: transformedUsers.filter(u => u.is_verified && !u.is_blocked).length,
        unverified: transformedUsers.filter(u => !u.is_verified && !u.is_blocked).length,
        suspended: transformedUsers.filter(u => u.is_blocked).length,
        verifiedSellers: transformedUsers.filter(u => u.user_type === 'supplier' && u.is_verified && !u.is_blocked).length,
        unverifiedSellers: transformedUsers.filter(u => u.user_type === 'supplier' && !u.is_verified && !u.is_blocked).length,
        // Buyers are auto-verified, so we track them separately
        autoVerifiedBuyers: transformedUsers.filter(u => u.user_type === 'owner' && u.is_verified && !u.is_blocked).length,
      };
      
      console.log('Fresh user statistics (buyers auto-verified):', userStats);

      // Transform requests data
      const transformedRequests: Request[] = (requestsData || []).map(req => ({
        id: req.id,
        make: req.car_make,
        model: req.car_model,
        year: req.car_year.toString(),
        part: req.part_needed,
        customer: 'Customer',
        location: req.location,
        phone: req.phone,
        status: req.status === 'pending' ? 'pending' : req.status === 'offer_received' ? 'matched' : 'completed',
        timestamp: new Date(req.created_at).toLocaleString(),
        ownerId: req.owner_id // Add owner ID for chat functionality
      }));

      // Transform offers data with new transaction completion fields
      const transformedOffers: Offer[] = (offersData || []).map(offer => ({
        id: offer.id,
        requestId: offer.request_id,
        supplier: offer.profiles ? `${offer.profiles.first_name || ''} ${offer.profiles.last_name || ''}`.trim() : 'Unknown Seller',
        price: `GHS ${offer.price}`,
        phone: offer.profiles?.phone || '',
        status: offer.status,
        transaction_completed: offer.transaction_completed || false,
        buyer_id: offer.buyer_id,
        supplierId: offer.supplier_id // Add supplier ID for chat functionality
      }));

      // Transform verifications data
      const transformedVerifications: SellerVerification[] = (verificationsData || []).map(verification => ({
        ...verification,
        verification_status: verification.verification_status as 'pending' | 'approved' | 'rejected'
      }));

      // Update all state
      setRequests(transformedRequests);
      setOffers(transformedOffers);
      setVerifications(transformedVerifications);
      setUsers(transformedUsers);

      console.log('Admin data updated successfully with fresh data (buyers auto-verified)');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    requests,
    offers,
    verifications,
    users,
    loading,
    refetchData: fetchData
  };
};
