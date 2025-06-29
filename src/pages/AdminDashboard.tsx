
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import RequestCard from "@/components/admin/RequestCard";
import OfferCard from "@/components/admin/OfferCard";
import VerificationCard from "@/components/admin/VerificationCard";
import UserCard from "@/components/admin/UserCard";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminActions } from "@/hooks/useAdminActions";
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

const AdminDashboard = () => {
  const { requests, offers, verifications, users, loading, refetchData } = useAdminData();
  const {
    handleMatchSupplier,
    handleCompleteRequest,
    handleVerificationAction,
    viewDocument,
    handleApproveUser,
    handleSuspendUser,
    handleDeleteUser,
    handleUnblockUser
  } = useAdminActions(refetchData);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleViewUserDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 font-inter">
      <AdminHeader />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <AdminStats
          pendingRequests={requests.filter(r => r.status === 'pending').length}
          matchedRequests={requests.filter(r => r.status === 'matched').length}
          completedRequests={requests.filter(r => r.status === 'completed').length}
          totalRequests={requests.length}
          pendingVerifications={verifications.filter(v => v.verification_status === 'pending').length}
        />

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm">
            <TabsTrigger value="requests" className="text-base font-inter">All Requests</TabsTrigger>
            <TabsTrigger value="offers" className="text-base font-inter">Seller Offers</TabsTrigger>
            <TabsTrigger value="verifications" className="text-base font-inter">Seller Verifications</TabsTrigger>
            <TabsTrigger value="users" className="text-base font-inter">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Customer Requests</h2>
              
              {requests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onMatchSupplier={handleMatchSupplier}
                  onCompleteRequest={handleCompleteRequest}
                  hasRelatedOffer={offers.some(o => o.requestId === request.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Seller Offers</h2>
              
              {offers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  relatedRequest={requests.find(r => r.id === offer.requestId)}
                  onAcceptOffer={handleMatchSupplier}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Seller Verifications
              </h2>
              
              {verifications.length === 0 ? (
                <Card className="p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30">
                  <div className="text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Verification Requests</h3>
                    <p className="text-sm">There are currently no seller verification requests to review.</p>
                  </div>
                </Card>
              ) : (
                verifications.map(verification => (
                  <VerificationCard
                    key={verification.id}
                    verification={verification}
                    onApprove={(id) => handleVerificationAction(id, 'approve')}
                    onReject={handleVerificationAction}
                    onViewDocument={viewDocument}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                User Management
              </h2>
              
              {users.length === 0 ? (
                <Card className="p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30">
                  <div className="text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                    <p className="text-sm">There are currently no users to manage.</p>
                  </div>
                </Card>
              ) : (
                users.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onApprove={handleApproveUser}
                    onSuspend={handleSuspendUser}
                    onDelete={handleDeleteUser}
                    onUnblock={handleUnblockUser}
                    onViewDetails={handleViewUserDetails}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          open={showUserDetails}
          onOpenChange={setShowUserDetails}
          onApprove={handleApproveUser}
          onSuspend={handleSuspendUser}
          onDelete={handleDeleteUser}
          onUnblock={handleUnblockUser}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
