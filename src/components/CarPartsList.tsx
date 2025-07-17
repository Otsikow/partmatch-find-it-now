
import React from 'react';
import CarPartCardWithChat from './CarPartCardWithChat';
import { formatDistance } from '@/utils/distanceUtils';

interface CarPart {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  part_type: string;
  condition: string;
  price: number;
  currency: string;
  description?: string;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  created_at: string;
  supplier_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
    rating?: number;
    total_ratings?: number;
    profile_photo_url?: string;
  };
}

interface CarPartsListProps {
  parts: CarPart[];
  loading?: boolean;
  error?: string | null;
  showDistance?: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const CarPartsList = ({ parts, loading, error, showDistance, userLocation }: CarPartsListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-t-lg"></div>
            <div className="bg-white p-4 sm:p-5 rounded-b-lg border space-y-3">
              <div className="h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-6 sm:py-8 lg:py-12 px-4">
        <div className="text-red-500 text-sm sm:text-base lg:text-lg mb-2">Error loading parts</div>
        <div className="text-red-400 text-xs sm:text-sm">{error}</div>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 lg:py-12 px-4">
        <div className="text-gray-500 text-sm sm:text-base lg:text-lg mb-2">No car parts found</div>
        <div className="text-gray-400 text-xs sm:text-sm">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
          {parts.length} part{parts.length !== 1 ? 's' : ''} found
        </h2>
      </div>
      
      {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3-4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {parts.map((part) => (
          <CarPartCardWithChat 
            key={part.id} 
            part={part} 
            showDistance={showDistance && !!part.latitude && !!part.longitude}
            distanceText={part.distance !== undefined ? formatDistance(part.distance) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default CarPartsList;
