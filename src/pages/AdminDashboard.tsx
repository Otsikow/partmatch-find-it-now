import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminStats from "@/components/admin/AdminStats";
import RequestCard from "@/components/admin/RequestCard";
import OfferCard from "@/components/admin/OfferCard";
import VerificationCard from "@/components/admin/VerificationCard";
import UserDetailsCard from "@/components/admin/UserDetailsCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardHeader from "@/components/DashboardHeader";
import UserCategoryTabs from "@/components/admin/UserCategoryTabs";
import UserManagementStats from "@/components/admin/UserManagementStats";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ListingQualityManager from "@/components/admin/ListingQualityManager";
import WeeklyInsightsDashboard from "@/components/admin/WeeklyInsightsDashboard";
import BlogManager from "@/components/admin/BlogManager";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminActions } from "@/hooks/useAdminActions";
import { useState, useEffect, useRef, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
    handleUnblockUser,
  } = useAdminActions(refetchData);

  const [selectedVerification, setSelectedVerification] = useState<SellerVerification | null>(null);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const [activeUserTab, setActiveUserTab] = useState("sellers");
  const isMobile = useIsMobile();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized calculations for AdminStats
  const pendingRequestsCount = useMemo(() => requests.filter(r => r.status === 'pending').length, [requests]);
  const matchedRequestsCount = useMemo(() => requests.filter(r => r.status === 'matched').length, [requests]);
  const completedRequestsCount = useMemo(() => requests.filter(r => r.status === 'completed').length, [requests]);
  const pendingVerificationsCount = useMemo(() => verifications.filter(v => v.verification_status === 'pending').length, [verifications]);

  const handleViewVerificationDetails = (verification: SellerVerification) => {
    setSelectedVerification(verification);
    setShowVerificationDetails(true);
  };

  const handleNavigateToCategory = (category: string, filter?: string) => {
    console.log('Navigating to category:', category, 'with filter:', filter);
    setActiveTab("users");
    setActiveUserTab(category);
  };

  const handleNavigateToVerifications = () => {
    setActiveTab("verifications");
  };


  // Auto-refresh disabled to prevent UI instability - data will refresh on user actions
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Single Modern Header */}
      <DashboardHeader />

      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <AdminStats
            pendingRequests={pendingRequestsCount}
            matchedRequests={matchedRequestsCount}
            completedRequests={completedRequestsCount}
            totalRequests={requests.length}
            pendingVerifications={pendingVerificationsCount}
            onNavigateToVerifications={handleNavigateToVerifications}
            onNavigateToRequests={() => setActiveTab("requests")}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden lg:grid lg:grid-cols-8 w-full bg-card backdrop-blur-sm border mb-4">
            <TabsTrigger value="insights" className="text-sm xl:text-base font-inter truncate">
              Weekly Insights
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm xl:text-base font-inter truncate">
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-sm xl:text-base font-inter truncate">
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-sm xl:text-base font-inter truncate">
              Offers ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-sm xl:text-base font-inter truncate">
              Quality Checker
            </TabsTrigger>
            <TabsTrigger value="verifications" className="text-sm xl:text-base font-inter truncate">
              Verifications ({verifications.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="text-sm xl:text-base font-inter truncate">
              User Management
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-sm xl:text-base font-inter truncate">
              Blog
            </TabsTrigger>
          </TabsList>

          {/* Tablet Tab Navigation */}
          <TabsList className="hidden md:grid lg:hidden md:grid-cols-4 w-full bg-card backdrop-blur-sm border mb-4">
            <TabsTrigger value="insights" className="text-xs sm:text-sm font-inter truncate px-1">
              Insights
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm font-inter truncate px-1">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs sm:text-sm font-inter truncate px-1">
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-xs sm:text-sm font-inter truncate px-1">
              Offers ({offers.length})
            </TabsTrigger>
          </TabsList>

          <TabsList className="hidden md:grid lg:hidden md:grid-cols-4 w-full bg-card backdrop-blur-sm border mb-4">
            <TabsTrigger value="quality" className="text-xs sm:text-sm font-inter truncate px-1">
              Quality
            </TabsTrigger>
            <TabsTrigger value="verifications" className="text-xs sm:text-sm font-inter truncate px-1">
              Verifications ({verifications.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm font-inter truncate px-1">
              Users
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm font-inter truncate px-1">
              Blog
            </TabsTrigger>
          </TabsList>

          {/* Mobile Tab Navigation */}
          <div className="md:hidden space-y-2 mb-4">
            {/* Primary tabs */}
            <TabsList className="grid grid-cols-2 w-full bg-card backdrop-blur-sm border">
              <TabsTrigger value="insights" className="text-xs font-inter truncate px-1">
                Insights
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs font-inter truncate px-1">
                Analytics
              </TabsTrigger>
            </TabsList>
            
            {/* Secondary tabs */}
            <TabsList className="grid grid-cols-2 w-full bg-card backdrop-blur-sm border">
              <TabsTrigger value="requests" className="text-xs font-inter truncate px-1">
                Requests ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="offers" className="text-xs font-inter truncate px-1">
                Offers ({offers.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Tertiary tabs */}
            <TabsList className="grid grid-cols-4 w-full bg-card backdrop-blur-sm border">
              <TabsTrigger value="quality" className="text-xs font-inter truncate px-1">
                Quality
              </TabsTrigger>
              <TabsTrigger value="verifications" className="text-xs font-inter truncate px-1">
                Verify ({verifications.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs font-inter truncate px-1">
                Users
              </TabsTrigger>
              <TabsTrigger value="blog" className="text-xs font-inter truncate px-1">
                Blog
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="insights" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Weekly Marketplace Insights
              </h2>
              
              <div className="mx-2 sm:mx-0">
                <WeeklyInsightsDashboard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Analytics Dashboard
              </h2>
              
              <div className="mx-2 sm:mx-0">
                <AnalyticsDashboard 
                  onNavigateToUsers={() => setActiveTab("users")}
                  onNavigateToOffers={() => setActiveTab("offers")}
                  onNavigateToVerifications={() => setActiveTab("verifications")}
                  onNavigateToRequests={() => setActiveTab("requests")}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Customer Requests
              </h2>
              
              {requests.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-card border mx-2 sm:mx-0">
                  <div className="text-muted-foreground">
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
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Seller Offers
              </h2>
              
              {offers.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-card border mx-2 sm:mx-0">
                  <div className="text-muted-foreground">
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

          <TabsContent value="quality" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Listing Quality Management
              </h2>
              
              <div className="mx-2 sm:mx-0">
                <ListingQualityManager />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Seller Verifications
              </h2>
              
              {verifications.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-card border mx-2 sm:mx-0">
                  <div className="text-muted-foreground">
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
                      onApprove={(id, notes) => handleVerificationAction(id, 'approve', notes)}
                      onReject={(id, notes) => handleVerificationAction(id, 'reject', notes)}
                      onViewDocument={viewDocument}
                      onViewUserDetails={handleViewVerificationDetails}
                    />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                User Management
              </h2>
              
              <div className="mx-2 sm:mx-0">
                <UserManagementStats 
                  users={users} 
                  onNavigateToCategory={handleNavigateToCategory}
                />
              </div>
              
              {users.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center bg-card border mx-2 sm:mx-0">
                  <div className="text-muted-foreground">
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
                    onViewDetails={() => {}}
                    activeTab={activeUserTab}
                    onTabChange={setActiveUserTab}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-primary px-2 sm:px-0">
                Blog Management
              </h2>

              <div className="mx-2 sm:mx-0">
                <BlogManager />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Verification Details Modal */}
        <Dialog open={showVerificationDetails} onOpenChange={setShowVerificationDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seller Verification Details</DialogTitle>
            </DialogHeader>
            {selectedVerification && <UserDetailsCard user={selectedVerification} />}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
