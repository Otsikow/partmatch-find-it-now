import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CarPart } from "@/types/CarPart";
import { useMyParts } from "./useMyParts";

export const useMyPartsData = () => {
  const { parts, loading, error, refetch } = useMyParts();

  return {
    myParts: parts, // Direct reference, no unnecessary state duplication
    loading,
    error,
    refetch,
  };
};
