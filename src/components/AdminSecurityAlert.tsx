
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminSecurityAlert = () => {
  return (
    <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        <strong>🔒 SECURE ACCESS:</strong> Only authorized admin emails can access this portal. All login attempts are monitored and logged.
      </AlertDescription>
    </Alert>
  );
};

export default AdminSecurityAlert;
