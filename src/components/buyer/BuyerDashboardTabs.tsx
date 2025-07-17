
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Star, 
  FileText, 
  User 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SavedParts from "./SavedParts";
import MyOrders from "./MyOrders";
import BuyerProfile from "./BuyerProfile";
import BuyerDashboardContent from "./BuyerDashboardContent";

interface BuyerDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BuyerDashboardTabs = ({ activeTab, onTabChange }: BuyerDashboardTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 h-12">
        <TabsTrigger value="overview" className="flex items-center gap-2 h-10">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center gap-2 h-10">
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">Saved Parts</span>
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center gap-2 h-10">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">My Orders</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2 h-10">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <BuyerDashboardContent />
      </TabsContent>

      <TabsContent value="saved">
        <SavedParts />
      </TabsContent>

      <TabsContent value="orders">
        <MyOrders />
      </TabsContent>

      <TabsContent value="profile">
        <BuyerProfile />
      </TabsContent>
    </Tabs>
  );
};

export default BuyerDashboardTabs;
