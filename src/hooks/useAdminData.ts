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
}

interface Offer {
  id: string;
  requestId: string;
  supplier: string;
  price: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
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
      console.log('Fetching admin data...');
      
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

      // Fetch users from profiles table with forced fresh data and better error handling
      console.log('Fetching users from profiles with fresh data...');
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        setUsers([]);
      } else {
        console.log('Successfully fetched users:', usersData?.length || 0);
        console.log('Raw users data sample:', usersData?.slice(0, 2));
        
        // Try to fetch auth users to get emails, but handle the error gracefully
        let authUsers: any[] = [];
        try {
          const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.error('Error fetching auth users:', authError);
          } else {
            authUsers = authResponse?.users || [];
            console.log('Successfully fetched auth users:', authUsers.length);
          }
        } catch (error) {
          console.error('Auth API error:', error);
        }
        
        const transformedUsers: UserProfile[] = (usersData || []).map(user => {
          // Find matching auth user to get email (if available)
          const authUser = authUsers.find((au: any) => au.id === user.id);
          
          const transformedUser = {
            ...user,
            email: authUser?.email || `user-${user.id.slice(0, 8)}@unknown.com`,
            user_type: user.user_type as 'owner' | 'supplier' | 'admin'
          };
          
          console.log(`User ${user.id}: type=${user.user_type}, is_verified=${user.is_verified}, is_blocked=${user.is_blocked}, verified_at=${user.verified_at}`);
          return transformedUser;
        });
        
        console.log('Setting users state with transformed data:', transformedUsers.length);
        console.log('Users by type and verification status:', {
          suppliers: transformedUsers.filter(u => u.user_type === 'supplier').length,
          verified_suppliers: transformedUsers.filter(u => u.user_type === 'supplier' && u.is_verified).length,
          owners: transformedUsers.filter(u => u.user_type === 'owner').length,
          verified_owners: transformedUsers.filter(u => u.user_type === 'owner' && u.is_verified).length,
          admins: transformedUsers.filter(u => u.user_type === 'admin').length,
          total_verified: transformedUsers.filter(u => u.is_verified && !u.is_blocked).length,
          total_unverified: transformedUsers.filter(u => !u.is_verified && !u.is_blocked).length,
          total_blocked: transformedUsers.filter(u => u.is_blocked).length
        });
        
        // Force complete state refresh
        setUsers(transformedUsers);
      }

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
      
      console.log('Admin data fetch completed successfully');
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
