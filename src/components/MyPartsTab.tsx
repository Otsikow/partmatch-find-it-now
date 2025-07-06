import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { usePartManagement } from "@/hooks/usePartManagement";
import { CarPart } from "@/types/CarPart";
import PartCard from "./parts/PartCard";
import EditPartModal from "./parts/EditPartModal";

interface MyPartsTabProps {
  onRefresh: () => void;
}

const MyPartsTab = ({ onRefresh }: MyPartsTabProps) => {
  const { hasBusinessSubscription } = useSubscriptionStatus();
  const { parts, loading, updatePartStatus, deletePart, updatePart, fetchMyParts } = usePartManagement();
  const [selectedPartForBoost, setSelectedPartForBoost] = useState<string | null>(null);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);

  const handleEditPart = (part: CarPart) => {
    setEditingPart(part);
  };

  const handleUpdatePart = (partId: string, updatedData: Partial<CarPart>) => {
    updatePart(partId, updatedData);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your parts...</p>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600 mb-4">You haven't posted any parts yet.</p>
        <p className="text-sm text-gray-500">Click "Post New Part" to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {parts.map((part) => (
        <PartCard
          key={part.id}
          part={part}
          selectedPartForBoost={selectedPartForBoost}
          hasBusinessSubscription={hasBusinessSubscription}
          onEdit={handleEditPart}
          onDelete={deletePart}
          onUpdateStatus={updatePartStatus}
          onToggleBoost={setSelectedPartForBoost}
          onFeatureUpdate={fetchMyParts}
        />
      ))}

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
