import React from 'react';
import CarPartCardWithChat from './CarPartCardWithChat';

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
}

const CarPartsList = ({ parts, loading, error }: CarPartsListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-t-lg"></div>
            <div className="bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-b-lg border space-y-2 sm:space-y-3">
              <div className="h-4 sm:h-5 bg-gray-200 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded mt-3 sm:mt-4"></div>
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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
          {parts.length} part{parts.length !== 1 ? 's' : ''} found
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {parts.map((part) => (
          <CarPartCardWithChat key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
};

export default CarPartsList;
