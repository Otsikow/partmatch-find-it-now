import { Button } from "@/components/ui/button";
import { Settings, Calendar } from "lucide-react";
import { FilterSection } from "./FilterSection";

interface ModelYearFiltersProps {
  selectedMake: string;
  selectedModel: string;
  selectedYear: string;
  uniqueModels: string[];
  uniqueYears: string[];
  onModelChange: (model: string) => void;
  onYearChange: (year: string) => void;
}

export const ModelYearFilters = ({ 
  selectedMake, 
  selectedModel, 
  selectedYear, 
  uniqueModels, 
  uniqueYears, 
  onModelChange, 
  onYearChange 
}: ModelYearFiltersProps) => {
  if (!selectedMake) return null;

  return (
    <div className="space-y-4">
      {/* Model Filter */}
      <FilterSection title="Model" icon={<Settings className="h-4 w-4" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          <Button
            variant={selectedModel === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModelChange('')}
            className={`text-xs sm:text-sm col-span-2 sm:col-span-1 transition-all duration-200 ${
              selectedModel === '' 
                ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
            }`}
          >
            All Models
          </Button>
          {uniqueModels.map(model => (
            <Button
              key={model}
              variant={selectedModel === model ? 'default' : 'outline'}
              size="sm"
              onClick={() => onModelChange(model)}
              className={`text-xs sm:text-sm transition-all duration-200 ${
                selectedModel === model 
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                  : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {model}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Year Filter */}
      {selectedModel && (
        <FilterSection title="Year" icon={<Calendar className="h-4 w-4" />}>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            <Button
              variant={selectedYear === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onYearChange('')}
              className={`text-xs sm:text-sm transition-all duration-200 ${
                selectedYear === '' 
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                  : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              All Years
            </Button>
            {uniqueYears.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => onYearChange(year)}
                className={`text-xs sm:text-sm transition-all duration-200 ${
                  selectedYear === year 
                    ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                    : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {year}
              </Button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
};