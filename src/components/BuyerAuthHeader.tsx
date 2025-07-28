
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface BuyerAuthHeaderProps {
  isLogin: boolean;
  showPasswordReset: boolean;
}

const BuyerAuthHeader = ({ isLogin, showPasswordReset }: BuyerAuthHeaderProps) => {
  return (
    <header className="relative bg-gradient-to-r from-primary via-primary/95 to-primary-foreground text-white shadow-lg border-b border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10"></div>
      <div className="relative p-4 sm:p-6 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white hover:text-white">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link to="/" className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-white/30 transition-colors">
            <img 
              src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
              alt="PartMatch Logo" 
              className="h-6 w-auto sm:h-8 object-contain bg-white rounded-lg p-1"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
              Buyer {showPasswordReset ? 'Password Reset' : (isLogin ? 'Sign In' : 'Registration')}
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
              {showPasswordReset ? 'Reset your password to continue' : (isLogin ? 'Welcome back to your account' : 'Join our marketplace as a buyer')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BuyerAuthHeader;
