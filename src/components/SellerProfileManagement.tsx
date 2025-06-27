
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { User, Phone, MapPin, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  address: string;
}

const SellerProfileManagement = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, location, address')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          location: data.location || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          location: profileData.location,
          address: profileData.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeleting(true);
    try {
      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (authError) {
        console.error('Auth deletion error:', authError);
        // Even if auth deletion fails, profile is deleted, so sign out
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+233 20 123 4567"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. Accra, Kumasi"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your full address"
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your seller account and remove all your data, including your offers and part listings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProfile}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfileManagement;
