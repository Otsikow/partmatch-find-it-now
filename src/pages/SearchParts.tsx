import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import SearchControls from "@/components/SearchControls";
import PartsList from "@/components/PartsList";
import { mockParts } from "@/data/mockParts";
import { filterParts } from "@/utils/partFilters";
import Footer from "@/components/Footer";

const SearchParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const filteredParts = useMemo(() => {
    return filterParts(mockParts, searchTerm, selectedMake, selectedModel, selectedYear);
  }, [searchTerm, selectedMake, selectedModel, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 font-inter">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-emerald-600 flex-shrink-0" />
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent truncate">
            Search for Parts
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 max-w-3xl">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <PartsList parts={filteredParts} />
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SearchParts;
