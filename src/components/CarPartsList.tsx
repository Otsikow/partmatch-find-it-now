
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CarPart } from "@/types/CarPart";
import CarPartCard from "./CarPartCard";

interface CarPartsListProps {
  parts: (CarPart & {
    profiles?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      location?: string;
    };
  })[];
  loading?: boolean;
  error?: string | null;
}

const CarPartsList = ({ parts, loading, error }: CarPartsListProps) => {
  if (loading) {
    return (
      <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 mx-auto mb-4 sm:mb-6 animate-spin" />
        <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">Loading parts...</h3>
        <p className="text-gray-600 font-crimson text-base sm:text-lg">
          Please wait while we fetch the latest car parts.
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-red-50/90 to-red-100/50 backdrop-blur-sm border-0 shadow-lg">
        <Search className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4 sm:mb-6" />
        <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3 text-red-800">Error loading parts</h3>
        <p className="text-red-600 font-crimson text-base sm:text-lg mb-4">
          {error}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
          {parts.length} Parts Found
        </h2>
      </div>

      {parts.map(part => (
        <CarPartCard key={part.id} part={part} />
      ))}

      {parts.length === 0 && (
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
          <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No parts found</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 font-crimson text-base sm:text-lg">
            No car parts are currently available. Try again later or{' '}
            <Link to="/request" className="text-emerald-600 hover:underline font-medium">
              request the part you need
            </Link>
          </p>
        </Card>
      )}
    </div>
  );
};

export default CarPartsList;
