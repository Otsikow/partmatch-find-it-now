
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyerRequestsTab from '@/components/buyer/BuyerRequestsTab';
import MyOrders from '@/components/buyer/MyOrders';
import SavedParts from '@/components/buyer/SavedParts';
import BuyerProfile from '@/components/buyer/BuyerProfile';

export const BuyerDashboardTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['requests', 'orders', 'saved', 'profile'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('requests');
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="p-3 sm:p-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 rounded-xl p-1">
          <TabsTrigger 
            value="requests" 
            className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-primary/10"
          >
            <span className="truncate">My Requests</span>
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-primary/10"
          >
            <span className="truncate">My Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-primary/10"
          >
            <span className="truncate">Saved Parts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-primary/10"
          >
            <span className="truncate">Profile</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-6">
          <BuyerRequestsTab />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <MyOrders />
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <SavedParts />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <BuyerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};
