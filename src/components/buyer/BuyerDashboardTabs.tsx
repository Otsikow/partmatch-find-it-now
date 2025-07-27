
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
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Professional Responsive Tab Navigation */}
        <div className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full h-auto bg-transparent p-2 sm:p-4 grid grid-cols-5 gap-1 sm:gap-2">
              <TabsTrigger 
                value="requests" 
                className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-medium px-2 sm:px-4 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Requests
              </TabsTrigger>
              <TabsTrigger 
                value="offers" 
                className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-medium px-2 sm:px-4 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-medium px-2 sm:px-4 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="following" 
                className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-medium px-2 sm:px-4 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Following
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex-1 h-12 sm:h-14 text-xs sm:text-sm font-medium px-2 sm:px-4 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                Profile
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* Content Area - Optimized for All Screens */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <TabsContent value="requests" className="mt-0 focus-visible:outline-none">
            <BuyerRequestsTab />
          </TabsContent>
          
          <TabsContent value="offers" className="mt-0 focus-visible:outline-none">
            <BuyerOffersTab />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0 focus-visible:outline-none">
            <SavedParts />
          </TabsContent>
          
          <TabsContent value="following" className="mt-0 focus-visible:outline-none">
            <FollowedSellers />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
            <BuyerProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
