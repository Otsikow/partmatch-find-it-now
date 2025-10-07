import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProfilePhotoSection from "@/components/buyer/ProfilePhotoSection";
import PasswordChangeSection from "@/components/buyer/PasswordChangeSection";
import CountryCurrencySelector from "@/components/CountryCurrencySelector";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCountryCurrency } from "@/hooks/useUserCountryCurrency";
import {
  User,
  Phone,
  MapPin,
  Save,
  Globe,
  DollarSign,
} from "lucide-react";

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  country: string;
  profile_photo_url: string;
}

const ProfileManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { country, currency, loading: countryLoading } = useUserCountryCurrency();
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    country: "",
    profile_photo_url: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, city, country, profile_photo_url")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          city: data.city || "",
          country: data.country || "",
          profile_photo_url: data.profile_photo_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    setProfileData((prev) => ({ ...prev, profile_photo_url: photoUrl }));
  };

  const getInitials = () => {
    const firstName = profileData.first_name || "";
    const lastName = profileData.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be signed in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          city: profileData.city,
          country: profileData.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Profile Photo Section */}
      <ProfilePhotoSection
        profilePhotoUrl={profileData.profile_photo_url}
        userInitials={getInitials()}
        userId={user?.id || ""}
        onPhotoUpdate={handlePhotoUpdate}
      />

      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone/WhatsApp</Label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+233 20 123 4567"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g. Accra"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <div className="relative">
                <Globe className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="country"
                  value={profileData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="e.g. Ghana"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Location & Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Location & Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {countryLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Current Country</p>
                    <p className="font-medium">{country || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Currency</p>
                    <p className="font-medium">{currency || 'Not set'}</p>
                  </div>
                </div>
              </div>
              <CountryCurrencySelector />
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Password Change Section */}
      <PasswordChangeSection />
    </div>
  );
};

export default ProfileManagement;
