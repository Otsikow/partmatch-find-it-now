
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Clock, XCircle } from "lucide-react";

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

interface VerificationCardProps {
  verification: SellerVerification;
  onApprove: (verificationId: string) => void;
  onReject: (verificationId: string, notes: string) => void;
  onViewDocument: (documentUrl: string) => void;
}

const VerificationCard = ({ verification, onApprove, onReject, onViewDocument }: VerificationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleReject = () => {
    const notes = prompt('Enter rejection reason:');
    if (notes) {
      onReject(verification.id, notes);
    }
  };

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
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
            onClick={() => onViewDocument(verification.government_id_url!)}
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
            onClick={() => onViewDocument(verification.business_registration_url!)}
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
            onClick={() => onViewDocument(verification.proof_of_address_url!)}
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
            onClick={() => onApprove(verification.id)}
          >
            Approve
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            className="text-base shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleReject}
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
  );
};

export default VerificationCard;
