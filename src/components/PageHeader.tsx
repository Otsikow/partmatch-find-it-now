
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
    <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
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
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent truncate">
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
