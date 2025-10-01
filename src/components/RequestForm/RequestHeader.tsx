
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RequestHeader = () => {
  return (
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <img 
            src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
            alt="PartMatch Logo" 
            className="h-5 w-auto sm:h-6 md:h-8 flex-shrink-0 dark:bg-white rounded-lg p-1"
          />
        </Link>
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold text-primary truncate">Request a Part</h1>
      </div>
    </header>
  );
};

export default RequestHeader;
