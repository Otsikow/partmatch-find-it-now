import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CarPart } from "@/types/CarPart";

export const usePartManagement = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyParts();
  }, [user]);

  const fetchMyParts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedParts = (data || []).map(part => ({
        ...part,
        condition: part.condition as 'New' | 'Used' | 'Refurbished',
        status: part.status as 'available' | 'sold' | 'hidden' | 'pending'
      }));
      
      setParts(typedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast({
        title: "Error",
        description: "Failed to load your parts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part.",
        variant: "destructive"
      });
    }
  };

  const updatePart = (partId: string, updatedData: Partial<CarPart>) => {
    setParts(prev => prev.map(part => 
      part.id === partId ? { ...part, ...updatedData } : part
    ));
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