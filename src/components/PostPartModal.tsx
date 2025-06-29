import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PhotoUpload from "@/components/PhotoUpload";
import LocationPicker from "@/components/LocationPicker";
import { X } from "lucide-react";

interface PostPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartPosted: () => void;
}

const PostPartModal = ({ isOpen, onClose, onPartPosted }: PostPartModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    part_type: "",
    condition: "Used" as const,
    price: "",
    currency: "GHS"
  });

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      setPhotos(prev => [...prev, file]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('car-part-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('car-part-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== PART POSTING DEBUG START ===');
    
    if (!user) {
      console.log('❌ No user found in context');
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a part.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    });

    if (!location) {
      console.log('❌ No location selected');
      toast({
        title: "Location Required",
        description: "Please select a location on the map.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Location found:', location);

    setIsSubmitting(true);

    try {
      // Debug: Check current session and auth state
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('📋 Current session check:', {
        session: session,
        sessionError: sessionError,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });

      // Debug: Test RLS policies by checking if we can read from car_parts
      console.log('🔍 Testing RLS policies...');
      const { data: testRead, error: readError } = await supabase
        .from('car_parts')
        .select('id')
        .limit(1);
      
      console.log('📖 RLS Read test:', { testRead, readError });

      // Upload images first
      console.log('📸 Uploading images...');
      const imageUrls = [];
      for (const photo of photos) {
        try {
          const url = await uploadImage(photo);
          imageUrls.push(url);
          console.log('✅ Image uploaded:', url);
        } catch (imageError) {
          console.error('❌ Image upload failed:', imageError);
          throw imageError;
        }
      }
      console.log('📸 All images uploaded:', imageUrls);

      // Prepare the data for insertion with explicit debugging
      const insertData = {
        supplier_id: user.id,
        title: formData.title,
        description: formData.description || null,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        part_type: formData.part_type,
        condition: formData.condition,
        price: parseFloat(formData.price),
        currency: formData.currency,
        images: imageUrls.length > 0 ? imageUrls : null,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        status: 'available'
      };

      console.log('📋 Final insert data:', {
        ...insertData,
        supplier_id_type: typeof insertData.supplier_id,
        price_type: typeof insertData.price,
        year_type: typeof insertData.year,
        latitude_type: typeof insertData.latitude,
        longitude_type: typeof insertData.longitude
      });

      // Attempt to insert with detailed error logging
      console.log('💾 Attempting to insert into car_parts table...');
      const { data: insertedData, error: insertError } = await supabase
        .from('car_parts')
        .insert(insertData)
        .select();

      if (insertError) {
        console.error('❌ INSERT ERROR DETAILS:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
          full_error: insertError
        });

        // Additional RLS debugging
        if (insertError.message?.includes('row-level security policy')) {
          console.log('🔒 RLS Policy violation detected. Checking policies...');
          
          // Test if we can query auth.uid() indirectly
          const { data: profileTest, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .limit(1);
          
          console.log('👤 Profile lookup test:', { profileTest, profileError });
          
          // Check if user exists in profiles table (required for some RLS policies)
          if (!profileTest || profileTest.length === 0) {
            console.log('⚠️ User not found in profiles table - this might cause RLS issues');
          }
        }

        throw insertError;
      }

      console.log('✅ Successfully inserted car part:', insertedData);
      console.log('=== PART POSTING DEBUG END ===');

      toast({
        title: "Part Posted!",
        description: "Your part has been successfully listed for sale.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        part_type: "",
        condition: "Used",
        price: "",
        currency: "GHS"
      });
      setPhotos([]);
      setLocation(null);
      onPartPosted();
      onClose();

    } catch (error: any) {
      console.error('❌ FINAL ERROR:', {
        error: error,
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.log('=== PART POSTING DEBUG END (WITH ERROR) ===');
      
      toast({
        title: "Error",
        description: error.message || "Failed to post part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Part for Sale</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Corolla 2019 Headlights"
                required
              />
            </div>

            <div>
              <Label htmlFor="part_type">Part Type *</Label>
              <Input
                id="part_type"
                value={formData.part_type}
                onChange={(e) => setFormData(prev => ({ ...prev, part_type: e.target.value }))}
                placeholder="e.g., Headlight, Bumper, Engine"
                required
              />
            </div>

            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                placeholder="e.g., Toyota, Nissan"
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="e.g., Corolla, Altima"
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min="1990"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value: any) => setFormData(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the part condition, compatibility, etc."
              rows={3}
            />
          </div>

          <div>
            <Label>Location *</Label>
            <LocationPicker onLocationSelect={setLocation} />
            {location && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {location.address}
              </p>
            )}
          </div>

          <div>
            <Label>Photos</Label>
            <PhotoUpload onPhotoChange={handlePhotoChange} />
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Posting..." : "Post Part"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostPartModal;
