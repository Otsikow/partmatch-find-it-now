
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationAuthProps {
  user: any;
  userType: string | null;
  firstName: string | null;
  onSignOut: () => void;
  getDashboardLink: () => string;
  getDashboardLabel: () => string;
  getDisplayName: () => string;
}

const NavigationAuth = ({
  user,
  userType,
  firstName,
  onSignOut,
  getDashboardLink,
  getDashboardLabel,
  getDisplayName
}: NavigationAuthProps) => {
  if (user) {
    return (
      <div className="flex items-center gap-4 xl:gap-6">
        <span className="text-sm text-gray-600 font-medium hidden xl:block">
          Welcome, {getDisplayName()}
        </span>
        <Link to={getDashboardLink()}>
          <Button 
            variant="outline" 
            size="default" 
            className="border-green-600 text-green-700 hover:bg-green-50 font-medium px-4 xl:px-6 py-2 h-9 xl:h-10 text-sm"
          >
            {getDashboardLabel()}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="default" 
          onClick={onSignOut}
          className="text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium px-3 xl:px-4 py-2 h-9 xl:h-10 text-sm"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 xl:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="default" 
            className="text-gray-700 hover:text-green-700 hover:bg-green-50/50 font-medium px-3 xl:px-4 py-2 h-9 xl:h-10 text-sm"
          >
            Sign In
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuItem asChild>
            <Link to="/buyer-auth" className="w-full cursor-pointer py-3 px-4">
              Sign In as Buyer
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/seller-auth" className="w-full cursor-pointer py-3 px-4">
              Sign In as Seller
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin-auth" className="w-full cursor-pointer py-3 px-4">
              Sign In as Administrator
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link to="/auth">
        <Button 
          size="default" 
          className="bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-md font-medium px-4 xl:px-6 py-2 h-9 xl:h-10 text-sm"
        >
          Join Now
        </Button>
      </Link>
    </div>
  );
};

export default NavigationAuth;
