
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield, ShoppingCart, User } from "lucide-react";
import UserCard from "./UserCard";
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

interface UserCategoryTabsProps {
  users: UserProfile[];
  onApprove: (userId: string) => void;
  onSuspend: (userId: string, reason: string) => void;
  onDelete: (userId: string, reason: string) => void;
  onUnblock: (userId: string) => void;
  onViewDetails: (user: UserProfile) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const UserCategoryTabs = ({
  users,
  onApprove,
  onSuspend,
  onDelete,
  onUnblock,
  onViewDetails,
  activeTab = "sellers",
  onTabChange
}: UserCategoryTabsProps) => {
  const isMobile = useIsMobile();
  
  // Categorize users with memoization
  const { adminUsers, sellerUsers, buyerUsers, verifiedSellers, unverifiedSellers, suspendedSellers, activeBuyers, suspendedBuyers } = React.useMemo(() => {
    const adminUsers = users.filter(user => user.user_type === 'admin');
    const sellerUsers = users.filter(user => user.user_type === 'supplier');
    const buyerUsers = users.filter(user => user.user_type === 'owner');

    // Fixed categorization - don't exclude blocked users from verified count
    const verifiedSellers = sellerUsers.filter(user => user.is_verified);
    const unverifiedSellers = sellerUsers.filter(user => !user.is_verified);
    const suspendedSellers = sellerUsers.filter(user => user.is_blocked);

    // For buyers - show all active (non-blocked) and suspended separately
    const activeBuyers = buyerUsers.filter(user => !user.is_blocked);
    const suspendedBuyers = buyerUsers.filter(user => user.is_blocked);

    return { adminUsers, sellerUsers, buyerUsers, verifiedSellers, unverifiedSellers, suspendedSellers, activeBuyers, suspendedBuyers };
  }, [users]);

  const CategoryCard = ({ 
    title, 
    count, 
    users, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    count: number; 
    users: UserProfile[]; 
    icon: any; 
    color: string;
  }) => (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 px-2 sm:px-0">
        <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${color}`} />
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>{title}</h3>
        <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>{count}</Badge>
      </div>
      
      {users.length === 0 ? (
        <Card className="p-4 sm:p-6 text-center bg-card border-border mx-2 sm:mx-0">
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>No users in this category</p>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {users.map(user => (
            <div key={user.id} className="mx-2 sm:mx-0">
              <UserCard
                user={user}
                onApprove={onApprove}
                onSuspend={onSuspend}
                onDelete={onDelete}
                onUnblock={onUnblock}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className={`grid w-full grid-cols-3 bg-card backdrop-blur-sm border ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <TabsTrigger value="sellers" className={`${isMobile ? 'text-xs px-1' : 'text-base'} font-inter`}>
          <ShoppingCart className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
          {isMobile ? `Sellers (${sellerUsers.length})` : `Sellers (${sellerUsers.length})`}
        </TabsTrigger>
        <TabsTrigger value="buyers" className={`${isMobile ? 'text-xs px-1' : 'text-base'} font-inter`}>
          <User className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
          {isMobile ? `Buyers (${buyerUsers.length})` : `Buyers (${buyerUsers.length})`}
        </TabsTrigger>
        <TabsTrigger value="admins" className={`${isMobile ? 'text-xs px-1' : 'text-base'} font-inter`}>
          <Shield className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
          {isMobile ? `Admins (${adminUsers.length})` : `Admins (${adminUsers.length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sellers" className="mt-4 sm:mt-6">
        <div className="space-y-6 sm:space-y-8">
          <CategoryCard
            title="Verified Sellers"
            count={verifiedSellers.length}
            users={verifiedSellers}
            icon={UserCheck}
            color="text-green-600"
          />
          
          <CategoryCard
            title="Unverified Sellers"
            count={unverifiedSellers.length}
            users={unverifiedSellers}
            icon={UserX}
            color="text-yellow-600"
          />
          
          {suspendedSellers.length > 0 && (
            <CategoryCard
              title="Suspended Sellers"
              count={suspendedSellers.length}
              users={suspendedSellers}
              icon={UserX}
              color="text-red-600"
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="buyers" className="mt-4 sm:mt-6">
        <div className="space-y-6 sm:space-y-8">
          <CategoryCard
            title="Active Buyers"
            count={activeBuyers.length}
            users={activeBuyers}
            icon={UserCheck}
            color="text-green-600"
          />
          
          {suspendedBuyers.length > 0 && (
            <CategoryCard
              title="Suspended Buyers"
              count={suspendedBuyers.length}
              users={suspendedBuyers}
              icon={UserX}
              color="text-red-600"
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="admins" className="mt-4 sm:mt-6">
        <CategoryCard
          title="System Administrators"
          count={adminUsers.length}
          users={adminUsers}
          icon={Shield}
          color="text-purple-600"
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserCategoryTabs;
