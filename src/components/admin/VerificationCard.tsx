
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
      case 'approved': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'rejected': return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const handleApprove = () => {
    console.log('Approve verification clicked for:', verification.id);
    onApprove(verification.id);
  };

  const handleReject = () => {
    console.log('Reject verification clicked for:', verification.id);
    const notes = prompt('Enter rejection reason:');
    if (notes && notes.trim()) {
      onReject(verification.id, notes.trim());
    }
  };

  return (
    <Card className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair font-semibold text-base sm:text-lg lg:text-xl truncate">
            {verification.business_name || verification.full_name}
          </h3>
          <p className="text-gray-600 font-crimson text-sm sm:text-base lg:text-lg truncate">
            {verification.seller_type} - {verification.full_name}
          </p>
          <div className="text-xs sm:text-sm lg:text-base text-gray-500 font-inter space-y-1">
            <p className="truncate">Email: {verification.email}</p>
            <p className="truncate">Phone: {verification.phone}</p>
          </div>
        </div>
        <div className="flex flex-row lg:flex-col lg:text-right gap-2 lg:gap-1 items-start">
          <Badge className={`${getStatusColor(verification.verification_status)} flex items-center gap-1 text-xs sm:text-sm lg:text-base shrink-0`}>
            {getStatusIcon(verification.verification_status)}
            {verification.verification_status}
          </Badge>
          <p className="text-xs sm:text-sm text-gray-500 font-inter lg:mt-1 truncate max-w-[120px] lg:max-w-none">
            {new Date(verification.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-3 sm:mb-4 lg:mb-6 space-y-2">
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">
          <strong>Address:</strong> <span className="break-words">{verification.business_address}</span>
        </p>
        {verification.admin_notes && (
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-crimson">
            <strong>Admin Notes:</strong> <span className="break-words">{verification.admin_notes}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        {verification.government_id_url && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDocument(verification.government_id_url!)}
            className="text-xs sm:text-sm lg:text-base border-purple-200 hover:bg-purple-50 flex-1 sm:flex-none min-w-0"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
            <span className="truncate">View ID</span>
          </Button>
        )}
        {verification.business_registration_url && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDocument(verification.business_registration_url!)}
            className="text-xs sm:text-sm lg:text-base border-purple-200 hover:bg-purple-50 flex-1 sm:flex-none min-w-0"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
            <span className="truncate">View Registration</span>
          </Button>
        )}
        {verification.proof_of_address_url && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDocument(verification.proof_of_address_url!)}
            className="text-xs sm:text-sm lg:text-base border-purple-200 hover:bg-purple-50 flex-1 sm:flex-none min-w-0"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
            <span className="truncate">View Address Proof</span>
          </Button>
        )}
      </div>

      {verification.verification_status === 'pending' && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            className="text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
            onClick={handleReject}
          >
            Reject
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(`tel:${verification.phone}`, '_self')}
            className="text-xs sm:text-sm lg:text-base border-purple-200 hover:bg-purple-50 flex-1 sm:flex-none"
          >
            Call Seller
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VerificationCard;
