import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserDisplayName = (fallbackLabel: string = 'User') => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>(fallbackLabel);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) {
        setDisplayName(fallbackLabel);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setDisplayName(name || user.email?.split('@')[0] || fallbackLabel);
        } else {
          setDisplayName(user.email?.split('@')[0] || fallbackLabel);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setDisplayName(user.email?.split('@')[0] || fallbackLabel);
      }
    };

    fetchUserName();
  }, [user, fallbackLabel]);

  return displayName;
};
