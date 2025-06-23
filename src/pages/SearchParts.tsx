
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
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Search className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">Search Parts</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
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
