import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { FilterSection } from "./FilterSection";

interface DistanceFilterProps {
  maxDistance?: number;
  onChange: (distance: number) => void;
}

export const DistanceFilter = ({ maxDistance, onChange }: DistanceFilterProps) => {
  const distances = [50, 100, 200, 300];

  return (
    <FilterSection title="Maximum Distance" icon={<MapPin className="h-4 w-4" />}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {distances.map(distance => (
          <Button
            key={distance}
            variant={maxDistance === distance ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(distance)}
            className={`text-xs sm:text-sm transition-all duration-200 ${
              maxDistance === distance 
                ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
            }`}
          >
            {distance} miles
          </Button>
        ))}
      </div>
    </FilterSection>
  );
};