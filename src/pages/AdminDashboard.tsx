
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Building2, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AdminStats from "@/components/admin/AdminStats";
import RequestCard from "@/components/admin/RequestCard";
import OfferCard from "@/components/admin/OfferCard";
import VerificationCard from "@/components/admin/VerificationCard";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import AdminHeader from "@/components/admin/AdminHeader";
import UserCategoryTabs from "@/components/admin/UserCategoryTabs";
import UserManagementStats from "@/components/admin/UserManagementStats";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminActions } from "@/hooks/useAdminActions";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState("requests");
  const [activeUserTab, setActiveUserTab] = useState("sellers");
  const isMobile = useIsMobile();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewUserDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleNavigateToCategory = (category: string, filter?: string) => {
    console.log('Navigating to category:', category, 'with filter:', filter);
    setActiveTab("users");
    setActiveUserTab(category);
  };

  const handleNavigateToVerifications = () => {
    setActiveTab("verifications");
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Reduced auto-refresh frequency to prevent shaking - only refresh every 30 seconds
  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(() => {
      console.log('Auto-refreshing admin data...');
      refetchData();
    }, 30000); // Changed from 10 seconds to 30 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 font-inter">
      {/* Add back arrow to header */}
      <div className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8"
          />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">
              Manage your marketplace with ease
            </p>
          </div>
        </div>
        <AdminHeader onNavigateToVerifications={handleNavigateToVerifications} />
      </div>

      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <AdminStats
            pendingRequests={requests.filter(r => r.status === 'pending').length}
            matchedRequests={requests.filter(r => r.status === 'matched').length}
            completedRequests={requests.filter(r => r.status === 'completed').length}
            totalRequests={requests.length}
            pendingVerifications={verifications.filter(v => v.verification_status === 'pending').length}
            onNavigateToVerifications={handleNavigateToVerifications}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm ${isMobile ? 'mb-2' : 'mb-4'}`}>
            <TabsTrigger value="requests" className={`${isMobile ? 'text-xs px-2' : 'text-base'} font-inter`}>
              {isMobile ? 'Requests' : 'All Requests'}
            </TabsTrigger>
            <TabsTrigger value="offers" className={`${isMobile ? 'text-xs px-2' : 'text-base'} font-inter`}>
              {isMobile ? 'Offers' : 'Seller Offers'}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="verifications" className="text-base font-inter">Seller Verifications</TabsTrigger>
                <TabsTrigger value="users" className="text-base font-inter">User Management</TabsTrigger>
              </>
            )}
          </TabsList>

          {isMobile && (
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm mb-4">
              <TabsTrigger value="verifications" className="text-xs px-2 font-inter">Verifications</TabsTrigger>
              <TabsTrigger value="users" className="text-xs px-2 font-inter">Users</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="requests" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent px-2 sm:px-0">
                Customer Requests
              </h2>
              
              {requests.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30 mx-2 sm:mx-0">
                  <div className="text-gray-500">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Requests</h3>
                    <p className="text-xs sm:text-sm">There are currently no customer requests.</p>
                  </div>
                </Card>
              ) : (
                requests.map(request => (
                  <div key={request.id} className="mx-2 sm:mx-0">
                    <RequestCard
                      request={request}
                      onMatchSupplier={handleMatchSupplier}
                      onCompleteRequest={handleCompleteRequest}
                      hasRelatedOffer={offers.some(o => o.requestId === request.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent px-2 sm:px-0">
                Seller Offers
              </h2>
              
              {offers.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30 mx-2 sm:mx-0">
                  <div className="text-gray-500">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Offers</h3>
                    <p className="text-xs sm:text-sm">There are currently no seller offers.</p>
                  </div>
                </Card>
              ) : (
                offers.map(offer => (
                  <div key={offer.id} className="mx-2 sm:mx-0">
                    <OfferCard
                      offer={offer}
                      relatedRequest={requests.find(r => r.id === offer.requestId)}
                      onAcceptOffer={handleMatchSupplier}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent px-2 sm:px-0">
                Seller Verifications
              </h2>
              
              {verifications.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30 mx-2 sm:mx-0">
                  <div className="text-gray-500">
                    <Building2 className="h-8 sm:h-12 w-8 sm:w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Verification Requests</h3>
                    <p className="text-xs sm:text-sm">There are currently no seller verification requests to review.</p>
                  </div>
                </Card>
              ) : (
                verifications.map(verification => (
                  <div key={verification.id} className="mx-2 sm:mx-0">
                    <VerificationCard
                      verification={verification}
                      onApprove={(id) => handleVerificationAction(id, 'approve')}
                      onReject={handleVerificationAction}
                      onViewDocument={viewDocument}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent px-2 sm:px-0">
                User Management
              </h2>
              
              <div className="mx-2 sm:mx-0">
                <UserManagementStats 
                  users={users} 
                  onNavigateToCategory={handleNavigateToCategory}
                />
              </div>
              
              {users.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/30 mx-2 sm:mx-0">
                  <div className="text-gray-500">
                    <Users className="h-8 sm:h-12 w-8 sm:w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Users Found</h3>
                    <p className="text-xs sm:text-sm">There are currently no users to manage.</p>
                  </div>
                </Card>
              ) : (
                <div className="mx-2 sm:mx-0">
                  <UserCategoryTabs
                    users={users}
                    onApprove={handleApproveUser}
                    onSuspend={handleSuspendUser}
                    onDelete={handleDeleteUser}
                    onUnblock={handleUnblockUser}
                    onViewDetails={handleViewUserDetails}
                    activeTab={activeUserTab}
                    onTabChange={setActiveUserTab}
                  />
                </div>
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
