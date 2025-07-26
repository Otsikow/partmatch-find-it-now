import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
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
  const { loading, updatePartStatus, deletePart, updatePart, fetchMyParts } = usePartManagement();
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

  // Filter parts based on search term and filters
  const filteredParts = useMemo(() => {
    const result = parts.filter(part => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          part.title?.toLowerCase().includes(searchLower) ||
          part.make?.toLowerCase().includes(searchLower) ||
          part.model?.toLowerCase().includes(searchLower) ||
          part.part_type?.toLowerCase().includes(searchLower) ||
          part.description?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
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
    
    console.log("=== MyPartsTab Debug ===");
    console.log("Total parts passed to component:", parts.length);
    console.log("Filtered parts count:", result.length);
    console.log("Search term:", searchTerm);
    console.log("Filters:", filters);
    
    return result;
  }, [parts, searchTerm, filters]);

  const handleEditPart = (part: CarPart) => {
    setEditingPart(part);
  };

  const handleUpdatePart = (partId: string, updatedData: Partial<CarPart>) => {
    updatePart(partId, updatedData);
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
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredParts.map((part) => (
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
