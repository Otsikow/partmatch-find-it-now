
import React from 'react';
import { BuyerDashboardStats } from './BuyerDashboardStats';
import { BuyerDashboardTabs } from './BuyerDashboardTabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

export const BuyerDashboardContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerDashboardStats />
      
      {/* Prominent Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Link to="/request-part" className="flex-1">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Request Part
            </Button>
          </Link>
          
          <Link to="/search-parts-with-map" className="flex-1">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Parts
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white border-t border-gray-200">
        <BuyerDashboardTabs />
      </div>
    </div>
  );
};
