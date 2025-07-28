
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img 
            src="/lovable-uploads/734b3dc6-3104-4232-88b5-ecdfdf766610.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8 bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-md dark:shadow-white/10 border border-gray-200 dark:border-gray-700"
          />
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
          {isLogin ? 'Sign In' : 'Join Ghana'}
        </h1>
      </div>
    </header>
  );
};

export default AuthHeader;
