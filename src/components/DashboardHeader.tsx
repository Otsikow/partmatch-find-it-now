import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 p-2 bg-background">
      <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-muted">
        <ArrowLeft />
      </button>
      <button onClick={() => navigate("/")} className="p-2 rounded hover:bg-muted">
        <Home />
      </button>
      <span className="ml-2 font-semibold text-lg">Dashboard</span>
    </div>
  );
};

export default DashboardHeader;
