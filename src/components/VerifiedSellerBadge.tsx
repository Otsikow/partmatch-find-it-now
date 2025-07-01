
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface VerifiedSellerBadgeProps {
  isVerified: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VerifiedSellerBadge = ({ isVerified, className = "", size = 'md' }: VerifiedSellerBadgeProps) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      variant="secondary" 
      className={`bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 hover:from-green-200 hover:to-emerald-200 font-semibold ${sizeClasses[size]} ${className}`}
    >
      <Shield className={`${iconSizes[size]} mr-1 text-green-600`} />
      Verified Seller
    </Badge>
  );
};

export default VerifiedSellerBadge;
