import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";

export const usePartManagement = (initialParts: CarPart[] = [], onRefresh?: () => void) => {
  const [parts, setParts] = useState<CarPart[]>(initialParts);
  const [loading, setLoading] = useState(false);

  // Update local state when initialParts change
  useEffect(() => {
    setParts(initialParts);
  }, [initialParts]);

  const updatePartStatus = async (partId: string, newStatus: string) => {
    try {
      setLoading(true);
      console.log("usePartManagement: Updating part status", { partId, newStatus });
      
      const { error } = await supabase
        .from('car_parts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', partId);

      console.log("usePartManagement: Status update result:", { error });

      if (error) throw error;

      setParts(prev => prev.map(part => 
        part.id === partId ? { ...part, status: newStatus as 'available' | 'sold' | 'hidden' | 'pending' } : part
      ));

      toast({
        title: "Success",
        description: `Part ${newStatus === 'hidden' ? 'hidden' : 'made visible'} successfully.`,
      });
      
      console.log("usePartManagement: Calling onRefresh");
      onRefresh?.();
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part status.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePart = async (partId: string) => {
    try {
      setLoading(true);
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
      
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePart = async (partId: string, updatedData: Partial<CarPart>) => {
    try {
      setLoading(true);
      console.log("usePartManagement: Updating part", partId, "with data:", updatedData);
      
      const { error } = await supabase
        .from('car_parts')
        .update(updatedData)
        .eq('id', partId);

      console.log("usePartManagement: Update result:", { error });

      if (error) throw error;

      setParts(prev => prev.map(part =>
        part.id === partId ? { ...part, ...updatedData } : part
      ));

      toast({
        title: "Success",
        description: "Part updated successfully.",
      });
      
      onRefresh?.();
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: `Failed to update part: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    parts,
    loading,
    updatePartStatus,
    deletePart,
    updatePart
  };
};