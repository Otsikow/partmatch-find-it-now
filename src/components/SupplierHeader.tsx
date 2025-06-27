
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import VerifiedBadge from "@/components/VerifiedBadge";

const SupplierHeader = () => {
  return (
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-orange-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-600 flex-shrink-0" />
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent truncate">
          Seller Dashboard
        </h1>
        <VerifiedBadge isVerified={true} className="hidden sm:flex" />
      </div>
    </header>
  );
};

export default SupplierHeader;
