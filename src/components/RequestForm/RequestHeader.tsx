
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RequestHeader = () => {
  return (
    <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <img 
          src="/lovable-uploads/846aa041-c3b2-42f1-8842-2348e4ced1a4.png" 
          alt="PartMatch Logo" 
          className="h-6 w-auto sm:h-8"
        />
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Request a Part</h1>
      </div>
    </header>
  );
};

export default RequestHeader;
