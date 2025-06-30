
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  ShoppingCart, 
  User,
  AlertTriangle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserProfile {
  id: string;
  user_type: 'owner' | 'supplier' | 'admin';
  is_verified: boolean;
  is_blocked: boolean;
}

interface UserManagementStatsProps {
  users: UserProfile[];
  onNavigateToCategory: (category: string, filter?: string) => void;
}

const UserManagementStats = ({ users, onNavigateToCategory }: UserManagementStatsProps) => {
  const isMobile = useIsMobile();
  console.log('UserManagementStats received users:', users.length);
  console.log('Users breakdown:', users.map(u => ({ 
    id: u.id.slice(0, 8), 
    type: u.user_type, 
    verified: u.is_verified, 
    blocked: u.is_blocked 
  })));

  const stats = {
    total: users.length,
    admins: users.filter(u => u.user_type === 'admin').length,
    sellers: users.filter(u => u.user_type === 'supplier').length,
    buyers: users.filter(u => u.user_type === 'owner').length,
    verified: users.filter(u => u.is_verified && !u.is_blocked).length,
    unverified: users.filter(u => !u.is_verified && !u.is_blocked).length,
    suspended: users.filter(u => u.is_blocked).length,
    verifiedSellers: users.filter(u => u.user_type === 'supplier' && u.is_verified && !u.is_blocked).length,
    unverifiedSellers: users.filter(u => u.user_type === 'supplier' && !u.is_verified && !u.is_blocked).length,
  };

  console.log('Calculated stats:', stats);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor,
    onClick
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    bgColor: string;
    onClick?: () => void;
  }) => (
    <Card 
      className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${isMobile ? 'h-24' : 'h-auto'}`}
      onClick={onClick}
    >
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 pt-3 px-3' : 'pb-2'}`}>
        <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 leading-tight`}>
          {title}
        </CardTitle>
        <Icon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${color} flex-shrink-0`} />
      </CardHeader>
      <CardContent className={isMobile ? 'px-3 pb-3' : ''}>
        <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'} mb-4 sm:mb-6`}>
      <StatCard
        title="Total Users"
        value={stats.total}
        icon={Users}
        color="text-blue-600"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        onClick={() => {
          console.log('Total Users clicked - navigating to show all users');
          // Navigate to the tab with the most users to show all
          if (stats.buyers >= stats.sellers && stats.buyers >= stats.admins) {
            onNavigateToCategory('buyers');
          } else if (stats.sellers >= stats.admins) {
            onNavigateToCategory('sellers');
          } else {
            onNavigateToCategory('admins');
          }
        }}
      />
      
      <StatCard
        title="Sellers"
        value={stats.sellers}
        icon={ShoppingCart}
        color="text-purple-600"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        onClick={() => {
          console.log('Sellers clicked - navigating to sellers tab');
          onNavigateToCategory('sellers');
        }}
      />
      
      <StatCard
        title="Buyers"
        value={stats.buyers}
        icon={User}
        color="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100"
        onClick={() => {
          console.log('Buyers clicked - navigating to buyers tab');
          onNavigateToCategory('buyers');
        }}
      />
      
      <StatCard
        title="Admins"
        value={stats.admins}
        icon={Shield}
        color="text-indigo-600"
        bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
        onClick={() => {
          console.log('Admins clicked - navigating to admins tab');
          onNavigateToCategory('admins');
        }}
      />
      
      <StatCard
        title="Verified"
        value={stats.verified}
        icon={UserCheck}
        color="text-emerald-600"
        bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
        onClick={() => {
          console.log('Verified clicked - showing verified users. Stats:', {
            verified: stats.verified,
            verifiedSellers: stats.verifiedSellers,
            verifiedBuyers: users.filter(u => u.user_type === 'owner' && u.is_verified && !u.is_blocked).length
          });
          // Navigate to the category with most verified users
          const verifiedBuyers = users.filter(u => u.user_type === 'owner' && u.is_verified && !u.is_blocked).length;
          const verifiedAdmins = users.filter(u => u.user_type === 'admin' && u.is_verified && !u.is_blocked).length;
          
          if (stats.verifiedSellers >= verifiedBuyers && stats.verifiedSellers >= verifiedAdmins) {
            onNavigateToCategory('sellers');
          } else if (verifiedBuyers >= verifiedAdmins) {
            onNavigateToCategory('buyers');
          } else {
            onNavigateToCategory('admins');
          }
        }}
      />
      
      <StatCard
        title="Unverified"
        value={stats.unverified}
        icon={UserX}
        color="text-yellow-600"
        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
        onClick={() => {
          console.log('Unverified clicked - showing unverified users');
          // Navigate to the category with most unverified users
          const unverifiedBuyers = users.filter(u => u.user_type === 'owner' && !u.is_verified && !u.is_blocked).length;
          
          if (stats.unverifiedSellers >= unverifiedBuyers) {
            onNavigateToCategory('sellers');
          } else {
            onNavigateToCategory('buyers');
          }
        }}
      />
      
      <StatCard
        title="Suspended"
        value={stats.suspended}
        icon={AlertTriangle}
        color="text-red-600"
        bgColor="bg-gradient-to-br from-red-50 to-red-100"
        onClick={() => {
          console.log('Suspended clicked - showing suspended users');
          // Navigate to the category with most suspended users
          const suspendedSellers = users.filter(u => u.user_type === 'supplier' && u.is_blocked).length;
          const suspendedBuyers = users.filter(u => u.user_type === 'owner' && u.is_blocked).length;
          
          if (suspendedSellers >= suspendedBuyers) {
            onNavigateToCategory('sellers');
          } else {
            onNavigateToCategory('buyers');
          }
        }}
      />
      
      <Card className={`bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 ${isMobile ? 'h-24' : 'h-auto'}`}
            onClick={() => {
              console.log('Seller breakdown card clicked');
              onNavigateToCategory('sellers');
            }}>
        <CardHeader className={`flex flex-col space-y-1.5 ${isMobile ? 'pb-1 pt-2 px-3' : 'pb-2'}`}>
          <CardTitle className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 font-medium`}>
            Seller Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-1 ${isMobile ? 'px-3 pb-2' : 'space-y-2'}`}>
          <div className="flex items-center gap-2">
            <Badge className={`bg-green-100 text-green-800 ${isMobile ? 'text-xs px-1 py-0' : 'text-xs'}`}>
              Verified: {stats.verifiedSellers}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`bg-yellow-100 text-yellow-800 ${isMobile ? 'text-xs px-1 py-0' : 'text-xs'}`}>
              Pending: {stats.unverifiedSellers}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementStats;
