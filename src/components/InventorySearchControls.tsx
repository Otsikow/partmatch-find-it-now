import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventorySearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    make: string;
    model: string;
    category: string;
    condition: string;
    status: string;
  };
  onFiltersChange: (filters: {
    make: string;
    model: string;
    category: string;
    condition: string;
    status: string;
  }) => void;
  availableMakes: string[];
  availableModels: string[];
}

const InventorySearchControls = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableMakes,
  availableModels
}: InventorySearchControlsProps) => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);

  const carPartCategories = [
    "Engine Parts",
    "Brake System",
    "Transmission",
    "Suspension",
    "Electrical",
    "Body Parts",
    "Interior",
    "Exhaust System",
    "Cooling System",
    "Fuel System",
    "Steering",
    "Wheels & Tires",
    "Lights",
    "Other"
  ];

  const conditionOptions = [
    "Brand New",
    "Used - Excellent",
    "Used - Good", 
    "Used - Fair",
    "Refurbished"
  ];

  const statusOptions = [
    "available",
    "sold",
    "pending"
  ];

  const clearAllFilters = () => {
    onSearchChange("");
    onFiltersChange({
      make: "",
      model: "",
      category: "",
      condition: "",
      status: ""
    });
  };

  const hasActiveFilters = searchTerm || filters.make || filters.model || filters.category || filters.condition || filters.status;

  return (
    <Card className="p-4 mb-6 bg-card border-border">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your inventory by title, make, model, or part type..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-background border-border focus:border-primary"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Toggle Button for Mobile */}
        {isMobile && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                Active
              </span>
            )}
          </Button>
        )}

        {/* Filters Section */}
        <div className={`space-y-4 ${isMobile && !showFilters ? "hidden" : ""}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Make Filter */}
            <div>
              <Select value={filters.make || "all"} onValueChange={(value) => onFiltersChange({ ...filters, make: value === "all" ? "" : value })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {availableMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Filter */}
            <div>
              <Select 
                value={filters.model || "all"} 
                onValueChange={(value) => onFiltersChange({ ...filters, model: value === "all" ? "" : value })}
                disabled={!filters.make}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={filters.category || "all"} onValueChange={(value) => onFiltersChange({ ...filters, category: value === "all" ? "" : value })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {carPartCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition Filter */}
            <div>
              <Select value={filters.condition || "all"} onValueChange={(value) => onFiltersChange({ ...filters, condition: value === "all" ? "" : value })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditionOptions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={filters.status || "all"} onValueChange={(value) => onFiltersChange({ ...filters, status: value === "all" ? "" : value })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InventorySearchControls;