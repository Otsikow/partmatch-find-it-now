
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Part } from "@/types/Part";
import PartCard from "./PartCard";

interface PartsListProps {
  parts: Part[];
}

const PartsList = ({ parts }: PartsListProps) => {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between px-1 sm:px-0">
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {parts.length} Parts Found
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {parts.map(part => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>

      {parts.length === 0 && (
        <Card className="p-6 sm:p-8 lg:p-12 text-center bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm border-0 shadow-lg">
          <Search className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4 lg:mb-6" />
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">No parts found</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
            Try searching with different keywords or{' '}
            <Link to="/request-part" className="text-primary hover:underline font-medium">
              request the part you need
            </Link>
          </p>
        </Card>
      )}
    </div>
  );
};

export default PartsList;
