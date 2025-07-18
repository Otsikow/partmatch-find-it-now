
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfilePhotoSection from './ProfilePhotoSection';
import PersonalInfoSection from './PersonalInfoSection';
import PasswordChangeSection from './PasswordChangeSection';
import CountryCurrencySelector from '@/components/CountryCurrencySelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { getCurrencySymbol, getCountryConfig } from '@/lib/countryConfig';
import { useUserCountryCurrency } from '@/hooks/useUserCountryCurrency';

const BuyerProfile = () => {
  const { user } = useAuth();
  const { country, currency, countryCode, loading: countryCurrencyLoading } = useUserCountryCurrency();
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
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
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

      {/* Country & Currency Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Location & Currency</CardTitle>
          </div>
          <CardDescription>
            Set your country to automatically configure currency and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {countryCurrencyLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Loading...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Location</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {countryCode && country ? (
                      <>
                        <span>{getCountryConfig(countryCode)?.flag}</span>
                        <span>{country}</span>
                        <span>•</span>
                        <span>{getCurrencySymbol(currency || 'GHS')} {currency || 'GHS'}</span>
                      </>
                    ) : (
                      <span>No country selected</span>
                    )}
                  </div>
                </div>
                <CountryCurrencySelector 
                  trigger="button"
                  showCurrencyInfo={true}
                />
              </div>
              
              {currency && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  💡 All prices will be displayed in {currency} ({getCurrencySymbol(currency)}) based on your selected country.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <PasswordChangeSection />
    </div>
  );
};

export default BuyerProfile;
