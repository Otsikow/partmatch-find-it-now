import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="p-4 sm:p-6 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-accent text-foreground">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
              alt="PartMatch Logo" 
              className="h-8 w-auto object-contain transition-all duration-300 dark:bg-white rounded-lg p-1"
            />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join PartMatch"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;