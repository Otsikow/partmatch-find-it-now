
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
import { Upload, FileText, MapPin, Store } from 'lucide-react';

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
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(path, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('File upload error:', error);
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

      // Upload files
      const timestamp = Date.now();
      const userFolder = user.id;

      const governmentIdPath = await uploadFile(
        formData.governmentId,
        `${userFolder}/government-id-${timestamp}.${formData.governmentId.name.split('.').pop()}`
      );

      const proofOfAddressPath = await uploadFile(
        formData.proofOfAddress,
        `${userFolder}/proof-of-address-${timestamp}.${formData.proofOfAddress.name.split('.').pop()}`
      );

      let businessRegistrationPath = null;
      if (formData.businessRegistration) {
        businessRegistrationPath = await uploadFile(
          formData.businessRegistration,
          `${userFolder}/business-registration-${timestamp}.${formData.businessRegistration.name.split('.').pop()}`
        );
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

  const FileUploadField = ({ 
    label, 
    required, 
    file, 
    onChange, 
    accept = "image/*,.pdf",
    helpText,
    icon: Icon = FileText
  }: { 
    label: string; 
    required?: boolean; 
    file: File | null; 
    onChange: (file: File | null) => void;
    accept?: string;
    helpText?: string;
    icon?: React.ComponentType<any>;
  }) => (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {helpText && (
        <div className="mt-1 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <Store className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {helpText}
          </p>
        </div>
      )}
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-orange-400 transition-colors">
        <div className="space-y-1 text-center">
          <Icon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
              <span>{file ? file.name : 'Upload a file'}</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            
            <FileUploadField
              label="Government-issued Photo ID"
              required
              file={formData.governmentId}
              onChange={(file) => handleFileChange('governmentId', file)}
            />

            <FileUploadField
              label="Proof of Address"
              required
              file={formData.proofOfAddress}
              onChange={(file) => handleFileChange('proofOfAddress', file)}
            />

            {formData.sellerType && formData.sellerType !== 'Individual' && (
              <FileUploadField
                label="Business Registration Certificate"
                required
                file={formData.businessRegistration}
                onChange={(file) => handleFileChange('businessRegistration', file)}
              />
            )}

            <FileUploadField
              label="Profile Photo/Logo (Optional)"
              file={formData.profilePhoto}
              onChange={(file) => handleFileChange('profilePhoto', file)}
              accept="image/*"
            />

            <FileUploadField
              label="Shop, Garage, or Business Location Photo (Optional, but recommended for shops and garages)"
              file={formData.businessLocationPhoto}
              onChange={(file) => handleFileChange('businessLocationPhoto', file)}
              accept="image/*"
              helpText={showBusinessLocationMessage ? "Uploading a photo of your shop helps buyers trust your business." : undefined}
              icon={Store}
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
