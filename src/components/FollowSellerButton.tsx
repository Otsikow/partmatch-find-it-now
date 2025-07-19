import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSellerFollows } from '@/hooks/useSellerFollows';
import { useAuth } from '@/contexts/AuthContext';

interface FollowSellerButtonProps {
  sellerId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
}

const FollowSellerButton = ({ 
  sellerId, 
  variant = 'outline', 
  size = 'sm', 
  showText = true,
  className = ''
}: FollowSellerButtonProps) => {
  const { user } = useAuth();
  const { followSeller, unfollowSeller, isFollowing } = useSellerFollows();
  
  // Don't show follow button for users' own profile
  if (user?.id === sellerId) {
    return null;
  }

  const following = isFollowing(sellerId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (following) {
      await unfollowSeller(sellerId);
    } else {
      await followSeller(sellerId);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 transition-colors ${
        following ? 'text-red-600 border-red-600 hover:bg-red-50' : 'hover:text-primary'
      } ${className}`}
    >
      {following ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {showText && (
        <span>{following ? 'Following' : 'Follow'}</span>
      )}
    </Button>
  );
};

export default FollowSellerButton;