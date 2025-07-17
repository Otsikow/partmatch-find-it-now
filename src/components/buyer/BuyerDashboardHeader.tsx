
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

const BuyerDashboardHeader = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat with Seller
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Part
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardHeader;
