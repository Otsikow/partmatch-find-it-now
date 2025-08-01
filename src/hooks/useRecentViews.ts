import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useRecentViews = () => {
  const { user } = useAuth();

  const addRecentView = async (partId: string) => {
    if (!user) return;
    
    try {
      // Use the database function to add/update recent view
      const { error } = await supabase.rpc('add_recent_view', {
        user_id_param: user.id,
        part_id_param: partId
      });

      if (error) {
        console.error('Error adding recent view:', error);
      }
    } catch (error) {
      console.error('Error adding recent view:', error);
    }
  };

  const clearAllRecentViews = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('recent_views')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing recent views:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing recent views:', error);
      return false;
    }
  };

  return {
    addRecentView,
    clearAllRecentViews
  };
};