import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin, Calendar, Building2 } from 'lucide-react';

interface UserDetails {
  full_name?: string;
  seller_type?: string;
  business_name?: string;
  business_address?: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
}

interface UserDetailsCardProps {
  user: UserDetails;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ user }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <User className="h-6 w-6 text-purple-600" />
          <span>{user.full_name || 'N/A'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Seller Type</p>
              <p>{user.seller_type || 'N/A'}</p>
            </div>
          </div>
          {user.business_name && (
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Business Name</p>
                <p>{user.business_name}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Phone</p>
              <p>{user.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Email</p>
              <p>{user.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Date of Birth</p>
              <p>{formatDate(user.date_of_birth)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Business Address</p>
              <p>{user.business_address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
