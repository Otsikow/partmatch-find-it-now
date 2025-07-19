
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyerRequestsTab from '@/components/buyer/BuyerRequestsTab';
import MyOrders from '@/components/buyer/MyOrders';
import SavedParts from '@/components/buyer/SavedParts';
import BuyerProfile from '@/components/buyer/BuyerProfile';
import FollowedSellers from '@/components/buyer/FollowedSellers';

export const BuyerDashboardTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['requests', 'orders', 'saved', 'following', 'profile'].includes(tab)) {
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 sm:mb-8 bg-transparent p-0 gap-2 sm:gap-3 h-auto">
          <TabsTrigger 
            value="requests" 
            className="flex-1 min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            My Requests
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="flex-1 min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            My Orders
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="flex-1 min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Saved Parts
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="flex-1 min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="flex-1 min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Profile
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
        
        <TabsContent value="following" className="mt-6">
          <FollowedSellers />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <BuyerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};
