
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface BuyerAuthHeaderProps {
  isLogin: boolean;
  showPasswordReset: boolean;
}

const BuyerAuthHeader = ({ isLogin, showPasswordReset }: BuyerAuthHeaderProps) => {
  return (
    <header className="header-gradient shadow-lg border-b border-primary/20">
      <div className="p-4 sm:p-6 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary-foreground/20 text-primary-foreground">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <Link to="/" className="bg-primary-foreground/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-primary-foreground/30 transition-colors">
            <img 
              src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
              alt="PartMatch Logo" 
              className="h-8 w-auto object-contain bg-primary-foreground rounded-lg p-1 transition-all duration-300"
            />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground">
              {showPasswordReset ? "Reset Password" : isLogin ? "Welcome Back Buyer" : "Join as Buyer"}
            </h1>
            <p className="text-sm text-primary-foreground/90">
              {showPasswordReset ? "Reset your password to continue" : isLogin ? "Sign in to find car parts" : "Create your buyer account"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BuyerAuthHeader;
