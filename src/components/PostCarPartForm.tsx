
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
import { Package, Upload } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

interface CarPartFormData {
  title: string;
  description: string;
  make: string;
  model: string;
  year: string;
  partType: string;
  condition: string;
  price: string;
  address: string;
  images: File[];
}

const PostCarPartForm = ({ onPartPosted }: { onPartPosted: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<CarPartFormData>({
    title: '',
    description: '',
    make: '',
    model: '',
    year: '',
    partType: '',
    condition: '',
    price: '',
    address: '',
    images: [],
  });

  const handleInputChange = (field: keyof CarPartFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setCurrentPhoto(file);
    if (file) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images.slice(0, 4), file] // Limit to 5 images
      }));
    }
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `car-parts/${user?.id}/${timestamp}-${index}.${image.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('car-part-images')
        .upload(fileName, image);

      if (error) throw error;
      return data.path;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.make || !formData.model || !formData.year || 
          !formData.partType || !formData.condition || !formData.price || !formData.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive"
        });
        return;
      }

      // Upload images if any
      let imagePaths: string[] = [];
      if (formData.images.length > 0) {
        imagePaths = await uploadImages(formData.images);
      }

      // Save car part
      const { error } = await supabase
        .from('car_parts')
        .insert({
          supplier_id: user.id,
          title: formData.title,
          description: formData.description,
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year),
          part_type: formData.partType,
          condition: formData.condition,
          price: price,
          address: formData.address,
          images: imagePaths,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Part Posted Successfully!",
        description: "Your car part has been posted and is now available for buyers.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        make: '',
        model: '',
        year: '',
        partType: '',
        condition: '',
        price: '',
        address: '',
        images: [],
      });
      setCurrentPhoto(null);
      onPartPosted();
    } catch (error: any) {
      console.error('Part posting error:', error);
      toast({
        title: "Posting Failed",
        description: error.message || "Failed to post part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Post Car Part
        </CardTitle>
        <p className="text-gray-600">
          Add a new car part to your inventory
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <Label htmlFor="title">Part Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Front Brake Pads for Toyota Camry"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the condition, compatibility, and any additional details..."
              rows={3}
            />
          </div>

          {/* Car Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Car Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Car Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Camry"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          {/* Part Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Part Type *</Label>
              <Select value={formData.partType} onValueChange={(value) => handleInputChange('partType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select part type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Body">Body</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Tires & Wheels">Tires & Wheels</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="For Parts">For Parts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (GHS) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="150.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Location/Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Accra, Greater Accra"
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Part Photos</Label>
            <PhotoUpload onPhotoChange={handlePhotoChange} currentPhoto={currentPhoto} />
            {formData.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.images.length} photo{formData.images.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800"
          >
            {loading ? 'Posting...' : 'Post Car Part'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCarPartForm;
