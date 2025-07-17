
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestsTab } from '@/components/RequestsTab';
import { MyOrders } from '@/components/buyer/MyOrders';
import { SavedParts } from '@/components/buyer/SavedParts';

export const BuyerDashboardTabs = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="text-sm">
            My Requests
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-sm">
            My Orders
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-sm">
            Saved Parts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-6">
          <RequestsTab />
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
