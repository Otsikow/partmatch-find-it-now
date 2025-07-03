
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RequestHeader = () => {
  return (
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <img 
            src="/lovable-uploads/partmatch-hero-logo.png" 
            alt="PartMatch Logo" 
            className="h-5 w-auto sm:h-6 md:h-8 flex-shrink-0"
          />
        </Link>
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent truncate">Request a Part</h1>
      </div>
    </header>
  );
};

export default RequestHeader;
