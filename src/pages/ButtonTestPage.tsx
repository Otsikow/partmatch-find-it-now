import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import AdminHeader from '@/components/admin/AdminHeader';

const ButtonTestPage = () => {
  const navigate = useNavigate();
  console.log('ButtonTestPage: Rendering test page for admin buttons');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Button Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Admin Header (Back Arrow Test)</h2>
        <AdminHeader />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Admin Notification Bell Test</h2>
        <AdminNotificationBell />
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold">Test Instructions:</h3>
        <ul className="list-disc list-inside mt-2">
          <li>Click the back arrow in the Admin Header - should navigate to home page</li>
          <li>Click the notification bell - should open/close the notifications popover</li>
          <li>Check browser console for any JavaScript errors</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Navigation (Go to Home)
        </button>
      </div>
    </div>
  );
};

export default ButtonTestPage;
