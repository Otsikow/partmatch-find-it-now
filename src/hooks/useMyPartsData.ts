import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CarPart } from "@/types/CarPart";
import { useMyParts } from "./useMyParts";

export const useMyPartsData = () => {
  const { user } = useAuth();
  const { parts, loading, error, refetch } = useMyParts();
  const [myParts, setMyParts] = useState<CarPart[]>(parts);

  useEffect(() => {
    setMyParts(parts);
  }, [parts]);

  return {
    myParts,
    loading,
    error,
    refetch,
  };
};
