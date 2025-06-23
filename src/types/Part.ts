
export interface Part {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  price: string;
  condition: 'New' | 'Used' | 'Refurbished';
  supplier: string;
  location: string;
  phone: string;
  image?: string;
}
