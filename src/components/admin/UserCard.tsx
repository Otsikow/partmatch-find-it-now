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
  Shield, 
  Ban,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Eye,
  Star
} from "lucide-react";
import { useState } from "react";

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

interface UserCardProps {
  user: UserProfile;
  onApprove: (userId: string) => void;
  onSuspend: (userId: string, reason: string) => void;
  onDelete: (userId: string, reason: string) => void;
  onUnblock: (userId: string) => void;
  onViewDetails: (user: UserProfile) => void;
}

const UserCard = ({ user, onApprove, onSuspend, onDelete, onUnblock, onViewDetails }: UserCardProps) => {
  const [suspendReason, setSuspendReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusColor = (isBlocked: boolean, isVerified: boolean, userType: string) => {
    if (isBlocked) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
    // Buyers are auto-verified, so always show as verified
    if (userType === 'owner' || isVerified) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
  };

  const getStatusText = (isBlocked: boolean, isVerified: boolean, userType: string) => {
    if (isBlocked) return 'Suspended';
    // Buyers are auto-verified
    if (userType === 'owner') return 'Auto-Verified';
    if (isVerified) return 'Verified';
    return 'Unverified';
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'supplier': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'owner': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getUserTypeDisplayName = (userType: string) => {
    switch (userType) {
      case 'supplier': return 'Seller';
      case 'owner': return 'Buyer'; // Fixed: Changed from 'Owner' to 'Buyer'
      case 'admin': return 'Admin';
      default: return userType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSuspend = () => {
    if (suspendReason.trim()) {
      onSuspend(user.id, suspendReason);
      setSuspendReason('');
      setShowSuspendDialog(false);
    }
  };

  const handleDelete = () => {
    if (deleteReason.trim()) {
      onDelete(user.id, deleteReason);
      setDeleteReason('');
      setShowDeleteDialog(false);
    }
  };

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
  const isBuyer = user.user_type === 'owner';
  const needsApproval = !isBuyer && !user.is_verified && !user.is_blocked;

  return (
    <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-playfair font-semibold text-foreground">
              {fullName}
            </h3>
            <Badge className={`${getStatusColor(user.is_blocked, user.is_verified, user.user_type)} text-sm`}>
              {getStatusText(user.is_blocked, user.is_verified, user.user_type)}
            </Badge>
            <Badge className={`${getUserTypeColor(user.user_type)} text-sm`}>
              {getUserTypeDisplayName(user.user_type)}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-crimson">
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined: {formatDate(user.created_at)}</span>
            </div>
            {user.user_type === 'supplier' && user.rating !== undefined && user.total_ratings !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Rating: {user.rating.toFixed(1)}/5 ({user.total_ratings} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => onViewDetails(user)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>

        {/* Only show approve button for unverified suppliers */}
        {needsApproval && (
          <Button 
            onClick={() => onApprove(user.id)}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}

        {user.is_blocked ? (
          <Button 
            onClick={() => onUnblock(user.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Unblock
          </Button>
        ) : (
          <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/50"
                size="sm"
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="suspend-reason">Reason for suspension:</Label>
                  <Textarea
                    id="suspend-reason"
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Please provide a reason for suspending this user..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSuspend} className="bg-orange-600 hover:bg-orange-700 flex-1">
                    Suspend User
                  </Button>
                  <Button 
                    onClick={() => setShowSuspendDialog(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-800 dark:text-red-300">This action cannot be undone. The user account will be permanently deleted.</span>
              </div>
              <div>
                <Label htmlFor="delete-reason">Reason for deletion:</Label>
                <Textarea
                  id="delete-reason"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Please provide a reason for deleting this user..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDelete} variant="destructive" className="flex-1">
                  Delete User
                </Button>
                <Button 
                  onClick={() => setShowDeleteDialog(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default UserCard;
