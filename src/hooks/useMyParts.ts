import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import { useAuth } from "@/contexts/AuthContext";

export const useMyParts = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("car_parts")
        .select(
          `
          id,
          supplier_id,
          title,
          description,
          make,
          model,
          year,
          part_type,
          condition,
          price,
          currency,
          images,
          latitude,
          longitude,
          address,
          created_at,
          updated_at,
          status,
          is_featured,
          profiles!inner(
            first_name,
            last_name,
            phone,
            location,
            profile_photo_url,
            is_verified,
            rating,
            total_ratings
          )
        `
        )
        .eq("supplier_id", user.id)
        .in("status", ["available", "pending", "hidden"])
        .order("created_at", { ascending: false });

      console.log("=== useMyParts Debug ===");
      console.log("Query executed for user:", user.id);
      
      if (error) {
        console.error("Error fetching parts:", error);
        setError(error.message);
        return;
      }

      console.log("Raw data received:", data?.length || 0, "parts");
      console.log("First few parts:", data?.slice(0, 3));

      const transformedParts: CarPart[] = (data || []).map((part) => {
        let processedImages: string[] = [];
        if (part.images && Array.isArray(part.images)) {
          processedImages = part.images
            .filter((img) => typeof img === "string" && img.trim() !== "")
            .map((img) => {
              if (img.startsWith("http")) {
                return img;
              }
              if (img.includes("/")) {
                const {
                  data: { publicUrl },
                } = supabase.storage
                  .from("car-part-images")
                  .getPublicUrl(img);
                return publicUrl;
              }
              return img;
            });
        }

        return {
          ...part,
          condition: part.condition as "New" | "Used" | "Refurbished",
          status: part.status as "available" | "sold" | "hidden" | "pending",
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined,
        };
      });

      console.log("Transformed parts count:", transformedParts.length);
      console.log("Setting parts state with", transformedParts.length, "parts");
      setParts(transformedParts);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [user]);

  return { parts, loading, error, refetch: fetchParts };
};
