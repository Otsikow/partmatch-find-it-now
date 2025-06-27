
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface VerificationStatus {
  id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  full_name: string;
  seller_type: string;
  admin_notes?: string;
  created_at: string;
  verified_at?: string;
}

interface SellerVerificationStatusProps {
  verification: VerificationStatus;
}

const SellerVerificationStatus = ({ verification }: SellerVerificationStatusProps) => {
  const getStatusIcon = () => {
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
    switch (verification.verification_status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (verification.verification_status) {
      case 'approved':
        return "Congratulations! Your seller account has been verified. You can now start selling car parts.";
      case 'rejected':
        return "Your verification was not approved. Please review the feedback below and resubmit with correct information.";
      default:
        return "Your verification is under review. We'll notify you once it's processed (usually within 24-48 hours).";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Verification Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">{getStatusMessage()}</p>
        </div>

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

        {verification.admin_notes && (
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <strong className="text-orange-700">Admin Notes:</strong>
                <p className="text-gray-700 mt-1">{verification.admin_notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerVerificationStatus;
