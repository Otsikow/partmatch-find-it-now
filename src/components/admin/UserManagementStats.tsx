
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
  console.log('UserManagementStats received users:', users.length);
  console.log('Users breakdown:', users.map(u => ({ id: u.id, type: u.user_type, verified: u.is_verified, blocked: u.is_blocked })));

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
      className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Users"
        value={stats.total}
        icon={Users}
        color="text-blue-600"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        onClick={() => {
          // Show all users - default to sellers tab
          onNavigateToCategory('sellers');
        }}
      />
      
      <StatCard
        title="Sellers"
        value={stats.sellers}
        icon={ShoppingCart}
        color="text-purple-600"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        onClick={() => onNavigateToCategory('sellers')}
      />
      
      <StatCard
        title="Buyers"
        value={stats.buyers}
        icon={User}
        color="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100"
        onClick={() => onNavigateToCategory('buyers')}
      />
      
      <StatCard
        title="Admins"
        value={stats.admins}
        icon={Shield}
        color="text-indigo-600"
        bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
        onClick={() => onNavigateToCategory('admins')}
      />
      
      <StatCard
        title="Verified"
        value={stats.verified}
        icon={UserCheck}
        color="text-emerald-600"
        bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
        onClick={() => {
          // Navigate to sellers tab and show verified users across all categories
          if (stats.sellers > 0) {
            onNavigateToCategory('sellers');
          } else if (stats.buyers > 0) {
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
          // Navigate to sellers tab and show unverified users
          if (stats.sellers > 0 || stats.unverifiedSellers > 0) {
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
      
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => onNavigateToCategory('sellers')}>
        <CardHeader className="flex flex-col space-y-1.5 pb-2">
          <CardTitle className="text-xs text-gray-500 font-medium">Seller Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 text-xs">
              Verified: {stats.verifiedSellers}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Pending: {stats.unverifiedSellers}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementStats;
