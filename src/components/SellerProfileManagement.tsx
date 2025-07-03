
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
      console.log('Starting seller account deletion process for user:', user?.id);
      
      // First delete the user's profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      console.log('Profile deleted successfully');

      // Delete seller-specific data (car parts, offers, etc.)
      const { error: partsError } = await supabase
        .from('car_parts')
        .delete()
        .eq('supplier_id', user?.id);

      if (partsError) {
        console.error('Error deleting car parts:', partsError);
      }

      const { error: offersError } = await supabase
        .from('offers')
        .delete()
        .eq('supplier_id', user?.id);

      if (offersError) {
        console.error('Error deleting offers:', offersError);
      }

      // Get the current session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // Call the Edge Function to delete the user from Auth
      const { error: deleteUserError } = await supabase.functions.invoke('delete-user', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (deleteUserError) {
        console.error('Error calling delete-user function:', deleteUserError);
        throw deleteUserError;
      }

      console.log('User successfully deleted from Auth system');

      // Sign out the user locally
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your seller account has been permanently deleted.",
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error deleting seller account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
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
            Seller Profile Management
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
            <Label htmlFor="address">Business Address (Optional)</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your business address"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-2 sm:order-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting} className="w-full sm:w-auto order-1 sm:order-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your seller account and remove all your data, including your car parts listings and offers. You will be immediately signed out and will not be able to sign in again with these credentials.
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
