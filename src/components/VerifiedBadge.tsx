
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
}

const VerifiedBadge = ({ isVerified, className = "" }: VerifiedBadgeProps) => {
  if (!isVerified) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-100 text-blue-800 hover:bg-blue-200 ${className}`}
    >
      <CheckCircle className="h-3 w-3 mr-1" />
      Verified Seller
    </Badge>
  );
};

export default VerifiedBadge;
