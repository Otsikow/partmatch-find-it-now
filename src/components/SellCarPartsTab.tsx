import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import SellerVerificationForm from './SellerVerificationForm';
import SellerVerificationStatus from './SellerVerificationStatus';
import PostCarPartForm from './PostCarPartForm';
import AdminPartSeeder from './AdminPartSeeder';
import { Package, AlertCircle, CheckCircle, Shield } from 'lucide-react';

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
  const { user, userType } = useAuth();
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'verification' | 'post-part' | 'admin-seeder'>('post-part');

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
      ensureStorageBucket();
    }
  }, [user]);

  const ensureStorageBucket = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.id === 'car-part-images');
      
      if (!bucketExists) {
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

  const isVerified = verification?.verification_status === 'approved';

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      {verification && (
        <Card className={`border-2 ${
          isVerified 
            ? 'border-green-200 bg-green-50' 
            : verification.verification_status === 'rejected'
            ? 'border-red-200 bg-red-50'
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isVerified ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : verification.verification_status === 'rejected' ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <Shield className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  isVerified 
                    ? 'text-green-800' 
                    : verification.verification_status === 'rejected'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}>
                  {isVerified ? 'Verified Seller' : 
                   verification.verification_status === 'rejected' ? 'Verification Rejected' :
                   'Verification Pending'}
                </h3>
                <p className={`text-sm ${
                  isVerified 
                    ? 'text-green-700' 
                    : verification.verification_status === 'rejected'
                    ? 'text-red-700'
                    : 'text-yellow-700'
                }`}>
                  {isVerified ? 'Your account is verified. You can sell with full features!' :
                   verification.verification_status === 'rejected' ? 'Please review feedback and resubmit your verification.' :
                   'Your verification is under review. You can still post parts while we review your application.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unverified User Notice */}
      {!verification && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Get Verified for Better Sales</h3>
                <p className="text-blue-700 text-sm">
                  You can post parts now, but verified sellers get more visibility and trust from buyers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
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
          {verification ? 'View Verification' : 'Get Verified'}
        </Button>
        {userType === 'admin' && (
          <Button
            variant={activeView === 'admin-seeder' ? 'default' : 'outline'}
            onClick={() => setActiveView('admin-seeder')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Admin: Seed Parts
          </Button>
        )}
      </div>

      {/* Content */}
      {activeView === 'post-part' ? (
        <PostCarPartForm onPartPosted={handlePartPosted} />
      ) : activeView === 'admin-seeder' && userType === 'admin' ? (
        <AdminPartSeeder />
      ) : verification ? (
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
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">Seller Verification</h3>
            <p className="text-gray-600 mb-6">
              Get verified to increase trust with buyers and boost your sales.
            </p>
          </div>
          <SellerVerificationForm onVerificationSubmitted={handleVerificationSubmitted} />
        </div>
      )}
    </div>
  );
};

export default SellCarPartsTab;
