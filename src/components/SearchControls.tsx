
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  uniqueMakes: string[];
}

const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedMake, 
  setSelectedMake, 
  uniqueMakes 
}: SearchControlsProps) => {
  return (
    <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Input
            placeholder="Search parts (e.g. alternator, brake pads)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm sm:text-base md:text-lg border-emerald-200 focus:border-emerald-400"
          />
        </div>
        
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <Button
            variant={selectedMake === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMake('')}
            className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedMake === '' ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
          >
            All Makes
          </Button>
          {uniqueMakes.map(make => (
            <Button
              key={make}
              variant={selectedMake === make ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMake(make)}
              className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedMake === make ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
            >
              {make}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SearchControls;
