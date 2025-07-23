import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Building2, 
  FileText, 
  Eye,
  Check,
  X,
  Download
} from "lucide-react";
import { useState } from "react";
import UserDetailsCard from "./UserDetailsCard";

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

interface VerificationCardProps {
  verification: SellerVerification;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes: string) => void;
  onViewDocument: (url: string) => void;
  onViewUserDetails: (user: SellerVerification) => void;
}

const VerificationCard = ({ verification, onApprove, onReject, onViewDocument, onViewUserDetails }: VerificationCardProps) => {
  const [rejectNotes, setRejectNotes] = useState('');
  const [approveNotes, setApproveNotes] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApprove = () => {
    onApprove(verification.id, approveNotes);
    setApproveNotes('');
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    if (rejectNotes.trim()) {
      onReject(verification.id, rejectNotes);
      setRejectNotes('');
      setShowRejectDialog(false);
    }
  };

  const documents = [
    { label: 'Government ID', url: verification.government_id_url },
    { label: 'Business Registration', url: verification.business_registration_url },
    { label: 'Proof of Address', url: verification.proof_of_address_url },
    { label: 'Profile Photo', url: verification.profile_photo_url },
    { label: 'Business Location', url: verification.business_location_photo_url }
  ].filter(doc => doc.url);

  return (
    <Card className="p-6 bg-gradient-to-br from-white/90 to-purple-50/30 dark:from-gray-800/90 dark:to-purple-900/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-playfair font-semibold text-gray-900 dark:text-gray-100">
              {verification.full_name}
            </h3>
            <Badge className={`${getStatusColor(verification.verification_status)} text-sm`}>
              {verification.verification_status}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 font-crimson">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{verification.seller_type === 'individual' ? 'Individual Seller' : 'Business'}</span>
            </div>
            {verification.business_name && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{verification.business_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{verification.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{verification.email}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 font-crimson">
          Applied: {formatDate(verification.created_at)}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Documents Section */}
      <div className="mb-4">
        <h4 className="text-lg font-playfair font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Submitted Documents
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {documents.map((doc, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onViewDocument(doc.url!)}
              className="flex items-center gap-2 text-xs h-auto p-2 hover:bg-purple-50 dark:hover:bg-purple-900"
            >
              <Eye className="h-3 w-3" />
              <span className="truncate">{doc.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {verification.admin_notes && (
        <>
          <Separator className="my-4" />
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Admin Notes:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-crimson">{verification.admin_notes}</p>
          </div>
        </>
      )}

      {verification.verification_status === 'pending' && (
        <>
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Verification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="approve-notes">Optional Notes:</Label>
                    <Textarea
                      id="approve-notes"
                      value={approveNotes}
                      onChange={(e) => setApproveNotes(e.target.value)}
                      placeholder="e.g., 'Welcome to PartMatch!'"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                      Confirm Approval
                    </Button>
                    <Button
                      onClick={() => setShowApproveDialog(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Verification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reject-notes">Reason for rejection:</Label>
                    <Textarea
                      id="reject-notes"
                      value={rejectNotes}
                      onChange={(e) => setRejectNotes(e.target.value)}
                      placeholder="Please provide a reason for rejecting this verification..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleReject} variant="destructive" className="flex-1">
                      Reject Verification
                    </Button>
                    <Button 
                      onClick={() => setShowRejectDialog(false)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => onViewUserDetails(verification)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default VerificationCard;
