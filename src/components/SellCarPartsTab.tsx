
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import SellerVerificationForm from './SellerVerificationForm';
import SellerVerificationStatus from './SellerVerificationStatus';
import PostCarPartForm from './PostCarPartForm';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';

interface VerificationStatus {
  id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  full_name: string;
  seller_type: string;
  admin_notes?: string;
  created_at: string;
  verified_at?: string;
}

const SellCarPartsTab = () => {
  const { user } = useAuth();
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'verification' | 'post-part'>('verification');

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
      ensureStorageBucket();
    }
  }, [user]);

  const ensureStorageBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.id === 'car-part-images');
      
      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket('car-part-images', { public: true });
        if (error && !error.message.includes('already exists')) {
          console.error('Error creating storage bucket:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring storage bucket:', error);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Type cast the verification_status to ensure it matches our interface
      if (data) {
        const typedData: VerificationStatus = {
          ...data,
          verification_status: data.verification_status as 'pending' | 'approved' | 'rejected'
        };
        setVerification(typedData);
      }
    } catch (error) {
      console.error('Error fetching verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmitted = () => {
    fetchVerificationStatus();
  };

  const handlePartPosted = () => {
    toast({
      title: "Part Posted!",
      description: "Your car part has been added to the marketplace.",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading verification status...</p>
      </div>
    );
  }

  // Show verification form if no verification exists
  if (!verification) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-orange-700 mb-2">Seller Verification Required</h3>
          <p className="text-gray-600 mb-6">
            To start selling car parts on PartMatch Ghana, you need to complete the seller verification process.
          </p>
        </div>
        <SellerVerificationForm onVerificationSubmitted={handleVerificationSubmitted} />
      </div>
    );
  }

  // Show verification status if pending or rejected
  if (verification.verification_status !== 'approved') {
    return (
      <div className="space-y-6">
        <SellerVerificationStatus verification={verification} />
        {verification.verification_status === 'rejected' && (
          <div className="text-center">
            <Button
              onClick={() => {
                setVerification(null);
                fetchVerificationStatus();
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Resubmit Verification
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show seller tools if approved
  return (
    <div className="space-y-6">
      {/* Verification Success Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Verified Seller</h3>
              <p className="text-green-700">Your account is verified. You can now sell car parts!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          variant={activeView === 'post-part' ? 'default' : 'outline'}
          onClick={() => setActiveView('post-part')}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Post Car Part
        </Button>
        <Button
          variant={activeView === 'verification' ? 'default' : 'outline'}
          onClick={() => setActiveView('verification')}
        >
          View Verification
        </Button>
      </div>

      {/* Content */}
      {activeView === 'post-part' ? (
        <PostCarPartForm onPartPosted={handlePartPosted} />
      ) : (
        <SellerVerificationStatus verification={verification} />
      )}
    </div>
  );
};

export default SellCarPartsTab;
