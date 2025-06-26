
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
  created_at: string;
  updated_at: string;
  status: 'available' | 'sold' | 'hidden' | 'pending';
}
