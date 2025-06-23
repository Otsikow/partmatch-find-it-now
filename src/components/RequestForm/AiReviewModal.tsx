
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface AiReviewModalProps {
  isVisible: boolean;
}

const AiReviewModal = ({ isVisible }: AiReviewModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg animate-pulse">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-playfair font-semibold mb-2 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AI Review in Progress</h3>
        <p className="text-gray-600 text-sm font-crimson">
          Our AI is analyzing your request for approval...
        </p>
      </Card>
    </div>
  );
};

export default AiReviewModal;
