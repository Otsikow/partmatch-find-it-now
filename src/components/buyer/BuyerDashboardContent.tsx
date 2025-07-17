
import React from 'react';
import { BuyerDashboardStats } from './BuyerDashboardStats';
import { BuyerDashboardTabs } from './BuyerDashboardTabs';

export const BuyerDashboardContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerDashboardStats />
      <BuyerDashboardTabs />
    </div>
  );
};
