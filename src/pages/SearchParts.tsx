
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { mockParts } from "@/data/mockParts";
import { filterParts, getUniqueMakes } from "@/utils/partFilters";
import SearchControls from "@/components/SearchControls";
import PartsList from "@/components/PartsList";

const SearchParts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');

  const filteredParts = filterParts(mockParts, searchTerm, selectedMake);
  const uniqueMakes = getUniqueMakes(mockParts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 font-inter">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-emerald-600 flex-shrink-0" />
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent truncate">Search Parts</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMake={selectedMake}
          setSelectedMake={setSelectedMake}
          uniqueMakes={uniqueMakes}
        />

        <PartsList parts={filteredParts} />
      </main>
    </div>
  );
};

export default SearchParts;
