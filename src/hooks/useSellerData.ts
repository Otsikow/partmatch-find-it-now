import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
  owner_id: string;
}

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  contact_unlocked: boolean;
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    phone: string;
    location: string;
    owner_id: string;
  };
}

export const useSellerData = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add basic caching to avoid unnecessary re-fetches
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds cache

  const fetchWithRetry = async (fetchFn: () => Promise<any>, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchFn();
      } catch (error: any) {
        const isLastAttempt = i === retries - 1;
        const isRetryableError = 
          error.message?.includes('503') || 
          error.message?.includes('timeout') || 
          error.message?.includes('upstream connect error') ||
          error.code === 'PGRST301';

        console.log(`Attempt ${i + 1}/${retries} failed:`, error.message);

        if (isLastAttempt || !isRetryableError) {
          throw error;
        }

        // Exponential backoff: wait 1s, 2s, 4s
        const waitTime = Math.min(1000 * Math.pow(2, i), 8000);
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  };

  const fetchRequests = async () => {
    try {
      console.log("useSellerData: Fetching requests");
      
      const result = await fetchWithRetry(async () => {
        const { data, error } = await supabase
          .from("part_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("useSellerData: Error fetching requests:", error);
          throw error;
        }

        return data;
      });

      console.log("useSellerData: Fetched requests:", result?.length || 0);
      setRequests(result || []);
      return result;
    } catch (error: any) {
      console.error("useSellerData: Request fetch failed after retries:", error);
      
      const isServiceUnavailable = 
        error.message?.includes('503') || 
        error.message?.includes('timeout') || 
        error.message?.includes('upstream connect error');
      
      toast({
        title: "Connection Error",
        description: isServiceUnavailable 
          ? "Service temporarily unavailable. Please check your connection and try again."
          : "Failed to load requests. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchMyOffers = async () => {
    try {
      console.log("useSellerData: Fetching offers for user:", user?.id);
      
      const result = await fetchWithRetry(async () => {
        const { data, error } = await supabase
          .from("offers")
          .select(
            `
            *,
            request:part_requests(id, car_make, car_model, car_year, part_needed, phone, location, owner_id)
          `
          )
          .eq("supplier_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("useSellerData: Error fetching offers:", error);
          throw error;
        }

        return data;
      });

      console.log("useSellerData: Fetched offers:", result?.length || 0);
      setMyOffers(result || []);
      return result;
    } catch (error: any) {
      console.error("useSellerData: Offers fetch failed after retries:", error);
      
      const isServiceUnavailable = 
        error.message?.includes('503') || 
        error.message?.includes('timeout') || 
        error.message?.includes('upstream connect error');
      
      toast({
        title: "Connection Error",
        description: isServiceUnavailable 
          ? "Service temporarily unavailable. Please check your connection and try again."
          : "Failed to load your offers. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      // Basic caching - avoid fetching if recently fetched
      const now = Date.now();
      if (now - lastFetchRef.current < CACHE_DURATION) {
        console.log("useSellerData: Using cached data, skipping fetch");
        return;
      }

      setLoading(true);
      setError(null);
      console.log("useSellerData: Starting data fetch");
      lastFetchRef.current = now;

      // Fetch both requests and offers in parallel
      const [requestsResult, offersResult] = await Promise.allSettled([
        fetchRequests(),
        fetchMyOffers(),
      ]);

      if (requestsResult.status === "rejected") {
        console.error(
          "useSellerData: Failed to fetch requests:",
          requestsResult.reason
        );
      }

      if (offersResult.status === "rejected") {
        console.error(
          "useSellerData: Failed to fetch offers:",
          offersResult.reason
        );
      }

      // If both failed, show error
      if (
        requestsResult.status === "rejected" &&
        offersResult.status === "rejected"
      ) {
        setError("Failed to load dashboard data. Please try again.");
      }
    } catch (error) {
      console.error("useSellerData: Unexpected error in fetchData:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      console.log("useSellerData: Data fetch completed");
    }
  };

  useEffect(() => {
    if (user) {
      console.log("useSellerData: User found, fetching data for:", user.id);
      fetchData();
    } else {
      console.log("useSellerData: No user found");
      setLoading(false);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up real-time subscription for offer updates
  useEffect(() => {
    if (!user?.id) return;

    console.log(
      "useSellerData: Setting up realtime subscription for user:",
      user.id
    );
    const channel = supabase
      .channel("offer-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "offers",
          filter: `supplier_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("useSellerData: Offer updated via realtime:", payload);
          fetchMyOffers(); // Refresh offers when status changes
        }
      )
      .subscribe();

    return () => {
      console.log("useSellerData: Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    requests,
    myOffers,
    loading,
    error,
    refetch: fetchData,
  };
};