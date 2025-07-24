
import React from 'react';
import { BuyerDashboardHeader } from '@/components/buyer/BuyerDashboardHeader';
import { BuyerDashboardContent } from '@/components/buyer/BuyerDashboardContent';

const BuyerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <BuyerDashboardHeader />
      <BuyerDashboardContent />
    </div>
  );
};

export default BuyerDashboard;
