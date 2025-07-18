
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
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="requests" className="text-sm font-medium">
            My Requests
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-sm font-medium">
            My Orders
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-sm font-medium">
            Saved Parts
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-sm font-medium">
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
        
        <TabsContent value="profile" className="mt-6">
          <BuyerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};
