import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMyParts } from "./useMyParts";
import { CarPart } from "@/types/CarPart";

export const usePartManagement = () => {
  const { parts: initialParts, loading, refetch: fetchMyParts } = useMyParts();
  const [parts, setParts] = useState<CarPart[]>(initialParts);

  useState(() => {
    setParts(initialParts);
  });

  const updatePartStatus = async (partId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', partId);

      if (error) throw error;

      setParts(prev => prev.map(part => 
        part.id === partId ? { ...part, status: newStatus as 'available' | 'sold' | 'hidden' | 'pending' } : part
      ));

      toast({
        title: "Success",
        description: `Part ${newStatus === 'hidden' ? 'hidden' : 'made visible'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part status.",
        variant: "destructive"
      });
    }
  };

  const deletePart = async (partId: string) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .delete()
        .eq('id', partId);

      if (error) throw error;

      setParts(prev => prev.filter(part => part.id !== partId));
      toast({
        title: "Success",
        description: "Part deleted successfully.",
      });
      fetchMyParts();
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part.",
        variant: "destructive"
      });
    }
  };

  const updatePart = async (partId: string, updatedData: Partial<CarPart>) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .update(updatedData)
        .eq('id', partId);

      if (error) throw error;

      setParts(prev => prev.map(part =>
        part.id === partId ? { ...part, ...updatedData } : part
      ));

      toast({
        title: "Success",
        description: "Part updated successfully.",
      });
      fetchMyParts();
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part.",
        variant: "destructive"
      });
    }
  };

  return {
    parts,
    loading,
    fetchMyParts,
    updatePartStatus,
    deletePart,
    updatePart
  };
};