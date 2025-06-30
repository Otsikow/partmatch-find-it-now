
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
}

const UserManagementStats = ({ users }: UserManagementStatsProps) => {
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

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    bgColor: string;
  }) => (
    <Card className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
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
      />
      
      <StatCard
        title="Sellers"
        value={stats.sellers}
        icon={ShoppingCart}
        color="text-purple-600"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
      />
      
      <StatCard
        title="Buyers"
        value={stats.buyers}
        icon={User}
        color="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100"
      />
      
      <StatCard
        title="Admins"
        value={stats.admins}
        icon={Shield}
        color="text-indigo-600"
        bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
      />
      
      <StatCard
        title="Verified"
        value={stats.verified}
        icon={UserCheck}
        color="text-emerald-600"
        bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
      />
      
      <StatCard
        title="Unverified"
        value={stats.unverified}
        icon={UserX}
        color="text-yellow-600"
        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
      />
      
      <StatCard
        title="Suspended"
        value={stats.suspended}
        icon={AlertTriangle}
        color="text-red-600"
        bgColor="bg-gradient-to-br from-red-50 to-red-100"
      />
      
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500 font-medium">Seller Breakdown</div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 text-xs">
            Verified: {stats.verifiedSellers}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Pending: {stats.unverifiedSellers}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserManagementStats;
