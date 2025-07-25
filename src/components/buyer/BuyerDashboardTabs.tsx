
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyerRequestsTab from '@/components/buyer/BuyerRequestsTab';
import BuyerOffersTab from '@/components/buyer/BuyerOffersTab';
import SavedParts from '@/components/buyer/SavedParts';
import BuyerProfile from '@/components/buyer/BuyerProfile';
import FollowedSellers from '@/components/buyer/FollowedSellers';

export const BuyerDashboardTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['requests', 'offers', 'saved', 'following', 'profile'].includes(tab)) {
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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-6 sm:mb-8 bg-transparent p-0 gap-2 sm:gap-3 h-auto">
          <TabsTrigger 
            value="requests" 
            className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger 
            value="offers" 
            className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Offers
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Saved
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Following
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="flex-1 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3 sm:py-4 rounded-xl bg-background border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 hover:scale-105 data-[state=active]:scale-105"
          >
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-6">
          <BuyerRequestsTab />
        </TabsContent>
        
        <TabsContent value="offers" className="mt-6">
          <BuyerOffersTab />
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
