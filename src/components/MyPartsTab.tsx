import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { usePartManagement } from "@/hooks/usePartManagement";
import { CarPart } from "@/types/CarPart";
import PartCard from "./parts/PartCard";
import EditPartModal from "./parts/EditPartModal";
import InventorySearchControls from "./InventorySearchControls";

interface MyPartsTabProps {
  parts: CarPart[];
  onRefresh: () => void;
}

const MyPartsTab = ({ parts, onRefresh }: MyPartsTabProps) => {
  const { hasBusinessSubscription } = useSubscriptionStatus();
  const { loading, updatePartStatus, deletePart, updatePart } = usePartManagement(parts, onRefresh);
  const [selectedPartForBoost, setSelectedPartForBoost] = useState<string | null>(null);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    category: "",
    condition: "",
    status: ""
  });

  // Get unique values from parts for filter options
  const availableMakes = useMemo(() => {
    const makes = parts.map(part => part.make).filter(Boolean);
    return [...new Set(makes)].sort();
  }, [parts]);

  const availableModels = useMemo(() => {
    const models = parts
      .filter(part => !filters.make || part.make === filters.make)
      .map(part => part.model)
      .filter(Boolean);
    return [...new Set(models)].sort();
  }, [parts, filters.make]);

  // Helper function to normalize search terms for UK/US variations
  const normalizeSearchTerm = (term: string) => {
    const normalized = term.toLowerCase();
    // Handle UK/US spelling variations and plurals
    const variations: { [key: string]: string[] } = {
      'tyre': ['tire', 'tyres', 'tires'],
      'tire': ['tyre', 'tyres', 'tires'],
      'tyres': ['tire', 'tyre', 'tires'],
      'tires': ['tyre', 'tyres', 'tire'],
      'colour': ['color'],
      'color': ['colour'],
      'centre': ['center'],
      'center': ['centre'],
      'aluminium': ['aluminum'],
      'aluminum': ['aluminium'],
    };
    
    // Get all variations for the search term
    const searchVariations = [normalized];
    Object.entries(variations).forEach(([key, values]) => {
      if (normalized.includes(key)) {
        values.forEach(variant => {
          searchVariations.push(normalized.replace(key, variant));
        });
      }
    });
    
    return searchVariations;
  };

  // Enhanced search function with fuzzy matching
  const matchesSearchTerm = (part: CarPart, searchTerm: string) => {
    if (!searchTerm) return true;
    
    const searchVariations = normalizeSearchTerm(searchTerm);
    const searchFields = [
      part.title || '',
      part.make || '',
      part.model || '',
      part.part_type || '',
      part.description || '',
    ].map(field => field.toLowerCase());
    
    // Check if any search variation matches any field
    return searchVariations.some(variation => 
      searchFields.some(field => field.includes(variation))
    );
  };

  // Filter parts based on search term and filters
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      // Enhanced search term filter with UK/US variations
      if (!matchesSearchTerm(part, searchTerm)) {
        return false;
      }

      // Filter by make
      if (filters.make && part.make !== filters.make) return false;
      
      // Filter by model
      if (filters.model && part.model !== filters.model) return false;
      
      // Filter by category (part_type)
      if (filters.category && part.part_type !== filters.category) return false;
      
      // Filter by condition
      if (filters.condition && part.condition !== filters.condition) return false;
      
      // Filter by status
      if (filters.status && part.status !== filters.status) return false;

      return true;
    });
  }, [parts, searchTerm, filters]);

  // Helper function to check if part is featured (consistent with PartCard)
  const isPartFeatured = (part: CarPart) => {
    return part.is_featured || (part.featured_until && new Date(part.featured_until) > new Date());
  };

  // Split filtered parts into featured, visible, and hidden groups
  const featuredParts = useMemo(() => {
    return filteredParts.filter(part => part.status !== 'hidden' && isPartFeatured(part));
  }, [filteredParts]);

  const visibleParts = useMemo(() => {
    return filteredParts.filter(part => part.status !== 'hidden' && !isPartFeatured(part));
  }, [filteredParts]);

  const hiddenParts = useMemo(() => {
    return filteredParts.filter(part => part.status === 'hidden');
  }, [filteredParts]);


  const handleEditPart = (part: CarPart) => {
    setEditingPart(part);
  };

  const handleUpdatePart = async (partId: string, updatedData: Partial<CarPart>) => {
    await updatePart(partId, updatedData);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      make: "",
      model: "",
      category: "",
      condition: "",
      status: ""
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your parts...</p>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">You haven't posted any parts yet.</p>
        <p className="text-sm text-muted-foreground">Click "Post New Part" to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Controls */}
      <InventorySearchControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        availableMakes={availableMakes}
        availableModels={availableModels}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredParts.length} of {parts.length} parts
          {featuredParts.length > 0 && ` (${featuredParts.length} featured)`}
        </span>
        {(searchTerm || Object.values(filters).some(Boolean)) && (
          <span className="text-primary font-medium">
            Filters active
          </span>
        )}
      </div>

      {/* Parts List */}
      {filteredParts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-2">No parts match your search criteria.</p>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters.</p>
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="mx-auto"
            >
              Clear All Filters to See All Parts
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Featured Listings Section */}
          {featuredParts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-600 flex items-center gap-2">
                ⭐ Featured Listings
                <span className="text-sm font-normal text-muted-foreground">
                  ({featuredParts.length})
                </span>
              </h2>
              <div className="space-y-4">
                {featuredParts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    selectedPartForBoost={selectedPartForBoost}
                    hasBusinessSubscription={hasBusinessSubscription}
                    onEdit={handleEditPart}
                    onDelete={deletePart}
                    onUpdateStatus={updatePartStatus}
                    onToggleBoost={setSelectedPartForBoost}
                    onFeatureUpdate={onRefresh}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Listings Section */}
          {visibleParts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                Your Active Listings
                <span className="text-sm font-normal text-muted-foreground">
                  ({visibleParts.length})
                </span>
              </h2>
              <div className="space-y-4">
                {visibleParts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    selectedPartForBoost={selectedPartForBoost}
                    hasBusinessSubscription={hasBusinessSubscription}
                    onEdit={handleEditPart}
                    onDelete={deletePart}
                    onUpdateStatus={updatePartStatus}
                    onToggleBoost={setSelectedPartForBoost}
                    onFeatureUpdate={onRefresh}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hidden Listings Section */}
          {hiddenParts.length > 0 && (
            <div className="space-y-4">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                  Hidden from Buyers
                  <span className="text-sm font-normal">
                    ({hiddenParts.length})
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  These parts are currently hidden from buyers. You can unhide them to make them public again.
                </p>
                <div className="space-y-4 opacity-75">
                  {hiddenParts.map((part) => (
                    <PartCard
                      key={part.id}
                      part={part}
                      selectedPartForBoost={selectedPartForBoost}
                      hasBusinessSubscription={hasBusinessSubscription}
                      onEdit={handleEditPart}
                      onDelete={deletePart}
                      onUpdateStatus={updatePartStatus}
                      onToggleBoost={setSelectedPartForBoost}
                      onFeatureUpdate={onRefresh}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state when no parts in any section */}
          {featuredParts.length === 0 && visibleParts.length === 0 && hiddenParts.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-2">No parts match your search criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </Card>
          )}
        </div>
      )}

      <EditPartModal
        part={editingPart}
        isOpen={!!editingPart}
        onClose={() => setEditingPart(null)}
        onUpdate={handleUpdatePart}
      />
    </div>
  );
};

export default MyPartsTab;
