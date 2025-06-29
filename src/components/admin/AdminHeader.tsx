
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

const AdminHeader = () => {
  return (
    <header className="p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>
      </div>
      
      {/* Admin Notification Bell */}
      <div className="flex items-center gap-2">
        <AdminNotificationBell />
      </div>
    </header>
  );
};

export default AdminHeader;
