
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, showBackButton = true, backTo, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      {showBackButton && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50 flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
      
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <img 
          src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
          alt="PartMatch Logo" 
          className="h-6 w-auto sm:h-8"
        />
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-600 truncate">{subtitle}</p>
        )}
      </div>
      {children}
    </header>
  );
};

export default PageHeader;
