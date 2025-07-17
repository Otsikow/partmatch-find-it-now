
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyerRequestsTab from '@/components/buyer/BuyerRequestsTab';
import MyOrders from '@/components/buyer/MyOrders';
import SavedParts from '@/components/buyer/SavedParts';

export const BuyerDashboardTabs = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="requests" className="text-sm font-medium">
            My Requests
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-sm font-medium">
            My Orders
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-sm font-medium">
            Saved Parts
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
      </Tabs>
    </div>
  );
};
