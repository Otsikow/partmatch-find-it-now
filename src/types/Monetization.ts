
export interface MonetizationFeature {
  id: string;
  seller_id: string;
  listing_id?: string;
  feature_type: 'featured_listing' | 'boost_listing' | 'extra_photos' | 'business_subscription' | 'banner_ad';
  amount_paid: number;
  currency: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  payment_reference: string;
  created_at: string;
}

export interface SellerSubscription {
  id: string;
  seller_id: string;
  subscription_type: 'business';
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  auto_renew: boolean;
  payment_reference: string;
  created_at: string;
}

export interface ListingStats {
  free_photos_used: number;
  paid_photos_count: number;
  is_featured: boolean;
  is_boosted: boolean;
  featured_until?: string;
  boosted_until?: string;
}
