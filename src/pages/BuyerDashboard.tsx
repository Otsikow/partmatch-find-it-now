
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('Buyer');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setDisplayName(name || user.email?.split('@')[0] || 'Buyer');
        } else {
          setDisplayName(user.email?.split('@')[0] || 'Buyer');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setDisplayName(user.email?.split('@')[0] || 'Buyer');
      }
    };

    fetchUserName();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <PageHeader 
        title={`Welcome ${displayName}`}
        subtitle="Buyer Dashboard"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Buyer Dashboard</h2>
          <p className="text-gray-600">Manage your car part requests and orders here.</p>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
