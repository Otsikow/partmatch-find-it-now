
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfilePhotoSection from './ProfilePhotoSection';
import PersonalInfoSection from './PersonalInfoSection';
import PasswordChangeSection from './PasswordChangeSection';

const BuyerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    email: user?.email || '',
    profile_photo_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, address, profile_photo_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data,
          profile_photo_url: data.profile_photo_url || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    setProfile(prev => ({ ...prev, profile_photo_url: photoUrl }));
  };

  const getInitials = () => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <ProfilePhotoSection
        profilePhotoUrl={profile.profile_photo_url}
        userInitials={getInitials()}
        userId={user.id}
        onPhotoUpdate={handlePhotoUpdate}
      />

      <PersonalInfoSection
        profile={profile}
        onProfileChange={handleProfileChange}
        userId={user.id}
      />

      <Separator />

      <PasswordChangeSection />
    </div>
  );
};

export default BuyerProfile;
