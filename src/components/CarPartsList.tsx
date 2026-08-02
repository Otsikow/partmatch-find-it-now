import React from 'react';
import CarPartCardWithChat from './CarPartCardWithChat';
import { CarPart } from '@/types/CarPart';
import { Button } from '@/components/ui/button';
import { CloudOff, RefreshCw } from 'lucide-react';

interface CarPartsListProps {
  parts: CarPart[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  userLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    region?: string;
    country?: string;
  } | null;
}

const CarPartsList = ({ parts, loading, error, onRetry, userLocation }: CarPartsListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted aspect-video rounded-t-lg"></div>
            <div className="bg-card p-3 sm:p-4 lg:p-5 rounded-b-lg border border-border space-y-2 sm:space-y-3">
              <div className="h-4 sm:h-5 bg-muted rounded"></div>
              <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 sm:h-10 bg-muted rounded mt-3 sm:mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="apple-surface mx-auto max-w-lg px-6 py-10 text-center" role="alert">
        <CloudOff className="mx-auto mb-4 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <div className="mb-2 text-lg font-semibold text-foreground">Marketplace temporarily unavailable</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        {onRetry && (
          <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
        <div className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-2 font-medium">No car parts found</div>
        <div className="text-muted-foreground/70 text-xs sm:text-sm">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between px-1 sm:px-0">
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-foreground">
          {parts.length} part{parts.length !== 1 ? 's' : ''} found
        </h2>
      </div>
      
      {/* Responsive grid for car parts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {parts.map((part) => (
          <CarPartCardWithChat key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
};

export default CarPartsList;
