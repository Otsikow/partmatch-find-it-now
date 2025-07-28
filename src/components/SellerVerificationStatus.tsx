
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, Clock, CheckCircle, FileText, Upload, XCircle, AlertCircle } from 'lucide-react';
import SellerVerificationForm from './SellerVerificationForm';

interface VerificationStatus {
  id: string;
  verification_status: string;
  full_name: string;
  seller_type: string;
  admin_notes?: string | null;
  created_at: string;
  verified_at?: string | null;
}

interface SellerVerificationStatusProps {
  verification?: VerificationStatus | null;
  onVerificationRequired?: () => void;
  showEnforcement?: boolean;
}

const SellerVerificationStatus = ({ 
  verification: propVerification, 
  onVerificationRequired,
  showEnforcement = false 
}: SellerVerificationStatusProps) => {
  const { user } = useAuth();
  const [verification, setVerification] = useState<VerificationStatus | null>(propVerification || null);
  const [loading, setLoading] = useState(!propVerification);
  const [showForm, setShowForm] = useState(false);

  // Calculate status variables first, before any early returns
  const isVerified = verification?.verification_status === 'approved';
  const isRejected = verification?.verification_status === 'rejected';
  const isPending = verification?.verification_status === 'pending';

  // ALL hooks must be called before any conditional returns
  useEffect(() => {
    if (!propVerification && user) {
      fetchVerificationStatus();
    }
  }, [user, propVerification]);

  // Always call useEffect, but conditionally execute the logic inside
  useEffect(() => {
    if (!isVerified && onVerificationRequired) {
      onVerificationRequired();
    }
  }, [isVerified, onVerificationRequired]);

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVerification(data);
    } catch (error: any) {
      console.error('Error fetching verification status:', error);
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!verification) return <Upload className="h-5 w-5" />;
    
    switch (verification.verification_status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = () => {
    if (!verification) return <Badge className="bg-gray-100 text-gray-800">Not Submitted</Badge>;
    
    switch (verification.verification_status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Verified Seller</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
    }
  };

  const getStatusMessage = () => {
    if (!verification) {
      return "To start selling car parts, you need to complete seller verification. This helps build trust with buyers.";
    }
    
    switch (verification.verification_status) {
      case 'approved':
        return "Congratulations! You're a verified seller. You can now list parts and receive the verified seller badge.";
      case 'rejected':
        return verification.admin_notes 
          ? `Your verification was rejected: ${verification.admin_notes}. Please review feedback and resubmit.`
          : "Your verification was rejected. Please review your documents and resubmit.";
      default:
        return "Your verification documents are being reviewed. You'll be notified once the review is complete.";
    }
  };

  const handleStartVerification = () => {
    setShowForm(true);
  };

  const handleVerificationSubmitted = () => {
    setShowForm(false);
    fetchVerificationStatus();
    toast({
      title: "Verification Submitted",
      description: "Your verification has been submitted and is under review.",
    });
  };

  // Now safe to have conditional returns after all hooks are called
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show verification form if user clicked to start verification
  if (showForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowForm(false)}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <SellerVerificationForm onVerificationSubmitted={handleVerificationSubmitted} />
      </div>
    );
  }

  return (
    <Card className={showEnforcement ? "mb-6" : "max-w-2xl mx-auto"}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {showEnforcement ? <Shield className="h-5 w-5" /> : getStatusIcon()}
          Seller Verification Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status message and action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Alert className={`${isVerified ? 'border-green-200 bg-green-50' : 
              isPending ? 'border-yellow-200 bg-yellow-50' : 
              'border-orange-200 bg-orange-50'}`}>
              <AlertDescription className="text-sm">
                {getStatusMessage()}
              </AlertDescription>
            </Alert>
          </div>
          
          {(!verification || isRejected) && (
            <Button
              onClick={handleStartVerification}
              className="ml-4 bg-orange-600 hover:bg-orange-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              {verification ? 'Resubmit' : 'Start Verification'}
            </Button>
          )}
        </div>

        {/* Verification details */}
        {verification && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {verification.full_name}
            </div>
            <div>
              <strong>Seller Type:</strong> {verification.seller_type}
            </div>
            <div>
              <strong>Submitted:</strong> {new Date(verification.created_at).toLocaleDateString()}
            </div>
            {verification.verified_at && (
              <div>
                <strong>Reviewed:</strong> {new Date(verification.verified_at).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Admin notes for rejected verifications */}
        {verification?.admin_notes && (
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <strong className="text-orange-700">Admin Feedback:</strong>
                <p className="text-gray-700 mt-1">{verification.admin_notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits of verification for unverified sellers */}
        {!isVerified && showEnforcement && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Why Get Verified?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gain buyer trust with a verified seller badge</li>
              <li>• Increase your parts visibility in search results</li>
              <li>• Access premium seller features</li>
              <li>• Build credibility in the marketplace</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerVerificationStatus;
