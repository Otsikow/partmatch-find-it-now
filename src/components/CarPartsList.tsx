
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
  supplier?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_verified?: boolean;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg border">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error loading parts</div>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No car parts found</div>
        <div className="text-gray-400 text-sm">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parts.map((part) => (
        <CarPartCardWithChat key={part.id} part={part} />
      ))}
    </div>
  );
};

export default CarPartsList;
