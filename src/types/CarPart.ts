
export interface CarPart {
  id: string;
  supplier_id: string;
  title: string;
  description?: string;
  make: string;
  model: string;
  year: number;
  part_type: string;
  condition: 'New' | 'Used' | 'Refurbished';
  price: number;
  currency: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  address?: string;
  created_at: string;
  updated_at: string;
  status: 'available' | 'sold' | 'hidden' | 'pending';
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    location?: string;
    business_name?: string;
    is_verified?: boolean;
    rating?: number;
    total_ratings?: number;
  };
}
