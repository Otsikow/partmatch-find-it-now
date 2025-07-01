
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
    console.log('Displaying image URL:', firstImage);
    // Ensure we have a proper URL format
    if (firstImage.startsWith('http')) {
      return firstImage;
    }
    // Handle relative URLs by making them absolute
    return firstImage;
  }
  return null;
};
