
import React from 'react';
import { BuyerDashboardStats } from './BuyerDashboardStats';
import { BuyerDashboardTabs } from './BuyerDashboardTabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

export const BuyerDashboardContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <BuyerDashboardStats />
      
      {/* Optimized Action Buttons - Fully Responsive */}
      <div className="bg-background border-t border-border px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto">
          <Link to="/request-part" className="flex-1">
            <Button 
              size="lg" 
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Request Part
            </Button>
          </Link>
          
          <Link to="/search-parts-with-map" className="flex-1">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full h-12 sm:h-14 border-2 border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Browse Parts
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tabs Container - Optimized for Mobile */}
      <div className="bg-background">
        <BuyerDashboardTabs />
      </div>
    </div>
  );
};
