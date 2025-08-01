import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Lightbulb, Circle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CarPartCard from "@/components/CarPartCard";
import { useLocationFeaturedParts } from "@/hooks/useLocationFeaturedParts";

const FeaturedPartsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { featuredParts, loading, currentCountryCode, detectedCountry } = useLocationFeaturedParts();

  const filters = [
    { id: "engines", label: "Engines", icon: Wrench, category: "engine" },
    { id: "headlights", label: "Headlights", icon: Lightbulb, category: "lighting" },
    { id: "tires", label: "Tires", icon: Circle, category: "tire" },
    { id: "all", label: "Show All", icon: Search, category: null }
  ];

  const filteredParts = featuredParts.filter(part => {
    if (activeFilter === "all") return true;
    const filter = filters.find(f => f.id === activeFilter);
    return filter && part.part_type?.toLowerCase().includes(filter.category || "");
  });

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Featured Parts by Location
          </h2>
          {currentCountryCode && detectedCountry && (
            <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
              Showing parts near {detectedCountry.flag} {detectedCountry.name}
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center gap-2"
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Featured Parts Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-1"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredParts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredParts.slice(0, 8).map((part) => (
              <CarPartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">No Featured Parts</h3>
              <p className="text-muted-foreground">
                No featured parts available for the selected filter.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link to="/search-parts-with-map">
              View All Parts
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPartsSection;