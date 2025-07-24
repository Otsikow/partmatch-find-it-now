
import React from 'react';
import DashboardHeader from "@/components/DashboardHeader";
import { BuyerDashboardContent } from '@/components/buyer/BuyerDashboardContent';

const BuyerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <BuyerDashboardContent />
    </div>
  );
};

export default BuyerDashboard;
