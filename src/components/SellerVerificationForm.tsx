
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Store } from 'lucide-react';
import VerificationFileUpload from './VerificationFileUpload';

interface VerificationFormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  sellerType: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessAddress: string;
  governmentId: File | null;
  businessRegistration: File | null;
  proofOfAddress: File | null;
  profilePhoto: File | null;
  businessLocationPhoto: File | null;
}

const SellerVerificationForm = ({ onVerificationSubmitted }: { onVerificationSubmitted: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VerificationFormData>({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    email: user?.email || '',
    sellerType: '',
    businessName: '',
    businessRegistrationNumber: '',
    businessAddress: '',
    governmentId: null,
    businessRegistration: null,
    proofOfAddress: null,
    profilePhoto: null,
    businessLocationPhoto: null,
  });

  const handleInputChange = (field: keyof VerificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof VerificationFormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      console.log(`Uploading file to: ${path}`);
      console.log(`File size: ${file.size} bytes`);
      console.log(`File type: ${file.type}`);
      
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(path, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      console.log('Upload successful:', data);
      return data.path;
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.dateOfBirth || !formData.phone || !formData.sellerType || !formData.businessAddress) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.governmentId || !formData.proofOfAddress) {
        toast({
          title: "Missing Documents",
          description: "Government ID and Proof of Address are required.",
          variant: "destructive"
        });
        return;
      }

      if (formData.sellerType !== 'Individual' && (!formData.businessName || !formData.businessRegistration)) {
        toast({
          title: "Missing Business Information",
          description: "Business name and registration certificate are required for non-individual sellers.",
          variant: "destructive"
        });
        return;
      }

      // Upload files with better error handling
      const timestamp = Date.now();
      const userFolder = user.id;

      const governmentIdPath = await uploadFile(
        formData.governmentId,
        `${userFolder}/government-id-${timestamp}.${formData.governmentId.name.split('.').pop()}`
      );

      if (!governmentIdPath) {
        throw new Error("Failed to upload Government ID");
      }

      const proofOfAddressPath = await uploadFile(
        formData.proofOfAddress,
        `${userFolder}/proof-of-address-${timestamp}.${formData.proofOfAddress.name.split('.').pop()}`
      );

      if (!proofOfAddressPath) {
        throw new Error("Failed to upload Proof of Address");
      }

      let businessRegistrationPath = null;
      if (formData.businessRegistration) {
        businessRegistrationPath = await uploadFile(
          formData.businessRegistration,
          `${userFolder}/business-registration-${timestamp}.${formData.businessRegistration.name.split('.').pop()}`
        );
        
        if (!businessRegistrationPath) {
          throw new Error("Failed to upload Business Registration");
        }
      }

      let profilePhotoPath = null;
      if (formData.profilePhoto) {
        profilePhotoPath = await uploadFile(
          formData.profilePhoto,
          `${userFolder}/profile-photo-${timestamp}.${formData.profilePhoto.name.split('.').pop()}`
        );
      }

      let businessLocationPhotoPath = null;
      if (formData.businessLocationPhoto) {
        businessLocationPhotoPath = await uploadFile(
          formData.businessLocationPhoto,
          `${userFolder}/business-location-${timestamp}.${formData.businessLocationPhoto.name.split('.').pop()}`
        );
      }

      // Save verification data
      const { error } = await supabase
        .from('seller_verifications')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          phone: formData.phone,
          email: formData.email,
          seller_type: formData.sellerType,
          business_name: formData.businessName || null,
          business_registration_number: formData.businessRegistrationNumber || null,
          business_address: formData.businessAddress,
          government_id_url: governmentIdPath,
          business_registration_url: businessRegistrationPath,
          proof_of_address_url: proofOfAddressPath,
          profile_photo_url: profilePhotoPath,
          business_location_photo_url: businessLocationPhotoPath,
        });

      if (error) throw error;

      toast({
        title: "Verification Submitted!",
        description: "Your seller verification has been submitted for review. You'll be notified once approved.",
      });

      onVerificationSubmitted();
    } catch (error: any) {
      console.error('Verification submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const showBusinessLocationMessage = formData.sellerType === 'Garage/Shop' || formData.sellerType === 'Supplier/Importer';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Seller Verification
        </CardTitle>
        <p className="text-gray-600">
          Complete your seller verification to start selling car parts on PartMatch
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name (as on ID) *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+233 20 123 4567"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Seller Type */}
          <div>
            <Label>Seller Type *</Label>
            <Select value={formData.sellerType} onValueChange={(value) => handleInputChange('sellerType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select seller type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Garage/Shop">Garage/Shop</SelectItem>
                <SelectItem value="Supplier/Importer">Supplier/Importer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Business Information (if not Individual) */}
          {formData.sellerType && formData.sellerType !== 'Individual' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="ABC Car Parts Ltd"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                <Input
                  id="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                  placeholder="CS123456789"
                />
              </div>
            </div>
          )}

          {/* Address */}
          <div>
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Textarea
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              placeholder="Street address, city, region"
              required
            />
          </div>

          {/* Document Uploads */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            
            <VerificationFileUpload
              label="Government-issued Photo ID"
              required
              file={formData.governmentId}
              onChange={(file) => handleFileChange('governmentId', file)}
              accept="image/*,.pdf"
              helpText="Upload a clear photo of your national ID, passport, or driver's license"
            />

            <VerificationFileUpload
              label="Proof of Address"
              required
              file={formData.proofOfAddress}
              onChange={(file) => handleFileChange('proofOfAddress', file)}
              accept="image/*,.pdf"
              helpText="Utility bill, bank statement, or official document showing your address (not older than 3 months)"
            />

            {formData.sellerType && formData.sellerType !== 'Individual' && (
              <VerificationFileUpload
                label="Business Registration Certificate"
                required
                file={formData.businessRegistration}
                onChange={(file) => handleFileChange('businessRegistration', file)}
                accept="image/*,.pdf"
                helpText="Official business registration document from the registrar"
              />
            )}

            <VerificationFileUpload
              label="Profile Photo/Logo (Optional)"
              file={formData.profilePhoto}
              onChange={(file) => handleFileChange('profilePhoto', file)}
              accept="image/*"
              helpText="A professional photo or business logo to display on your profile"
            />

            <VerificationFileUpload
              label="Shop, Garage, or Business Location Photo (Optional, but recommended for shops and garages)"
              file={formData.businessLocationPhoto}
              onChange={(file) => handleFileChange('businessLocationPhoto', file)}
              accept="image/*"
              helpText={showBusinessLocationMessage ? "Uploading a photo of your shop helps buyers trust your business and increases sales." : "A photo of your business location or workshop"}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800"
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SellerVerificationForm;
