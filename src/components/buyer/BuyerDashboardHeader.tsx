
import React from 'react';
import { ArrowLeft, Settings, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const BuyerDashboardHeader = () => {
  const navigate = useNavigate();

  const handleChatWithSeller = () => {
    // Navigate to chat page
    navigate('/chat');
  };

  const handleViewPart = () => {
    // Navigate to search parts page
    navigate('/search-parts');
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Buyer Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your car part requests and orders</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleChatWithSeller}
          className="flex items-center space-x-2 text-sm font-medium"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat with Seller</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewPart}
          className="flex items-center space-x-2 text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          <span>View Part</span>
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-sm font-medium">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};
