// Utility function to calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Format distance for display
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km away`;
  } else {
    return `${Math.round(distanceKm)}km away`;
  }
};

// Check if location is in the same city (within 20km radius)
export const isInSameCity = (distanceKm: number): boolean => {
  return distanceKm <= 20;
};

// Get location display text
export const getLocationDisplayText = (
  userLat?: number,
  userLng?: number,
  partLat?: number,
  partLng?: number,
  partAddress?: string
): string => {
  // If we don't have coordinates, show address or fallback
  if (!userLat || !userLng || !partLat || !partLng) {
    return partAddress || 'Location not specified';
  }

  const distance = calculateDistance(userLat, userLng, partLat, partLng);
  
  if (isInSameCity(distance)) {
    return 'In your city';
  }
  
  return formatDistance(distance);
};