
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getConditionColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'new':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'used':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'refurbished':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getImageUrl = (images?: string[]) => {
  if (images && images.length > 0) {
    const firstImage = images[0];
    console.log('Processing image URL:', firstImage);
    console.log('Images array:', images);
    
    // If it's already a full URL, return as-is
    if (firstImage.startsWith('http')) {
      console.log('Using full URL:', firstImage);
      return firstImage;
    }
    
    // If it's a relative path, construct full Supabase URL
    const supabaseUrl = 'https://ytgmzhevgcmvevuwkocz.supabase.co';
    const fullUrl = `${supabaseUrl}/storage/v1/object/public/car-part-images/${firstImage}`;
    console.log('Constructed URL:', fullUrl);
    return fullUrl;
  }
  console.log('No images found:', images);
  return null;
};

export const formatPrice = (price: number, currency: string, country?: string) => {
  // If it's Ghana, force GHS currency regardless of what's stored
  if (country?.toLowerCase().includes('ghana')) {
    return `GHS ${price.toLocaleString()}`;
  }
  
  // Use proper currency symbols based on currency code
  switch (currency?.toUpperCase()) {
    case 'GHS':
      return `GHS ${price.toLocaleString()}`;
    case 'USD':
      return `$${price.toLocaleString()}`;
    case 'EUR':
      return `€${price.toLocaleString()}`;
    case 'GBP':
      return `£${price.toLocaleString()}`;
    case 'NGN':
      return `₦${price.toLocaleString()}`;
    default:
      // Default to GHS for any unknown currency in Ghana context
      return `${currency || 'GHS'} ${price.toLocaleString()}`;
  }
};
