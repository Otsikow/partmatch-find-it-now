
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PhotoUpload from "@/components/PhotoUpload";
import LocationPicker from "@/components/LocationPicker";
import { X, Camera } from "lucide-react";

interface PostPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartPosted: () => void;
}

const PostPartModal = ({ isOpen, onClose, onPartPosted }: PostPartModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  
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

  const MAX_FREE_IMAGES = 3;
  const MAX_PREMIUM_IMAGES = 10;

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      const maxImages = isPremium ? MAX_PREMIUM_IMAGES : MAX_FREE_IMAGES;
      
      if (photos.length >= maxImages) {
        if (!isPremium) {
          toast({
            title: "Photo Limit Reached",
            description: `You can upload up to ${MAX_FREE_IMAGES} photos for free. Upgrade to premium for more photos.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Maximum Photos Reached",
            description: `You can upload up to ${MAX_PREMIUM_IMAGES} photos with premium.`,
            variant: "destructive"
          });
        }
        return;
      }
      
      setPhotos(prev => [...prev, file]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpgradeRequest = () => {
    // TODO: Implement premium upgrade payment flow
    toast({
      title: "Premium Photos",
      description: "Premium photo upgrade feature coming soon!",
    });
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
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a part.",
        variant: "destructive"
      });
      return;
    }

    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting part submission for user:', user.id);

    try {
      // Upload images first
      const imageUrls = [];
      for (const photo of photos) {
        try {
          const url = await uploadImage(photo);
          imageUrls.push(url);
          console.log('Image uploaded successfully:', url);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          // Continue without this image rather than failing completely
        }
      }

      // Prepare the data for insertion
      const insertData = {
        supplier_id: user.id,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year.toString()),
        part_type: formData.part_type.trim(),
        condition: formData.condition,
        price: parseFloat(formData.price),
        currency: formData.currency,
        images: imageUrls.length > 0 ? imageUrls : null,
        latitude: parseFloat(location.lat.toString()),
        longitude: parseFloat(location.lng.toString()),
        address: location.address.trim(),
        status: 'available'
      };

      console.log('Inserting part data:', {
        supplier_id: insertData.supplier_id,
        title: insertData.title,
        auth_user_id: user.id
      });

      // Insert the car part
      const { data: insertedData, error: insertError } = await supabase
        .from('car_parts')
        .insert([insertData])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Part inserted successfully:', insertedData);

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
      setIsPremium(false);
      onPartPosted();
      onClose();

    } catch (error: any) {
      console.error('Error posting part:', error);
      
      toast({
        title: "Error Posting Part",
        description: error?.message || "Failed to post part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxImages = isPremium ? MAX_PREMIUM_IMAGES : MAX_FREE_IMAGES;

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
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({photos.length}/{maxImages})
              </Label>
              {photos.length >= MAX_FREE_IMAGES && !isPremium && (
                <Badge variant="secondary" className="text-xs">
                  Free limit reached
                </Badge>
              )}
              {isPremium && (
                <Badge className="text-xs bg-emerald-100 text-emerald-800">
                  Premium Active
                </Badge>
              )}
            </div>
            
            <PhotoUpload 
              onPhotoChange={handlePhotoChange} 
              maxFreeImages={MAX_FREE_IMAGES}
              onUpgradeRequest={handleUpgradeRequest}
            />
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
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
