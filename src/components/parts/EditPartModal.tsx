import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import PhotoUpload from "@/components/PhotoUpload";
import { CAR_PART_CATEGORIES } from "@/constants/carPartCategories";

interface EditPartModalProps {
  part: CarPart | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (partId: string, updatedData: Partial<CarPart>) => void;
}

interface EditFormData {
  title: string;
  description: string;
  make: string;
  model: string;
  year: string;
  part_type: string;
  condition: string;
  price: string;
  address: string;
}

const EditPartModal = ({ part, isOpen, onClose, onUpdate }: EditPartModalProps) => {
  const [loading, setLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<EditFormData>({
    title: part?.title || '',
    description: part?.description || '',
    make: part?.make || '',
    model: part?.model || '',
    year: part?.year.toString() || '',
    part_type: part?.part_type || '',
    condition: part?.condition || '',
    price: part?.price.toString() || '',
    address: part?.address || ''
  });

  const handlePhotoChange = (file: File | null) => {
    setCurrentPhoto(file);
    if (file) {
      setNewImages(prev => [...prev.slice(0, 4), file]);
    }
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];
    
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `${part?.id}/${timestamp}-${index}.${image.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('car-part-images')
        .upload(fileName, image);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('car-part-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  // Update form data when part changes
  const updateFormData = (newPart: CarPart | null) => {
    if (newPart) {
      setFormData({
        title: newPart.title,
        description: newPart.description || '',
        make: newPart.make,
        model: newPart.model,
        year: newPart.year.toString(),
        part_type: newPart.part_type,
        condition: newPart.condition,
        price: newPart.price.toString(),
        address: newPart.address || ''
      });
    }
  };

  // Update form data whenever part prop changes
  if (part && (
    formData.title !== part.title ||
    formData.make !== part.make ||
    formData.model !== part.model
  )) {
    updateFormData(part);
  }

  const validateForm = (): boolean => {
    const price = parseFloat(formData.price);
    const year = parseInt(formData.year);

    if (!formData.title.trim() || !formData.make.trim() || !formData.model.trim() || 
        !formData.part_type || !formData.condition || !formData.address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
      toast({
        title: "Invalid Year",
        description: "Please enter a valid year.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!part || !validateForm()) return;

    setLoading(true);
    try {
      const price = parseFloat(formData.price);
      const year = parseInt(formData.year);

      console.log("EditPartModal: Starting update for part", part.id);
      console.log("EditPartModal: Form data:", formData);

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: year,
        part_type: formData.part_type,
        condition: formData.condition as 'New' | 'Used' | 'Refurbished',
        price: price,
        address: formData.address.trim(),
        updated_at: new Date().toISOString()
      };

      console.log("EditPartModal: Update data prepared:", updateData);

      // Let usePartManagement handle the database update
      await onUpdate(part.id, updateData);

      onClose();
    } catch (error) {
      console.error('EditPartModal: Error updating part:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Car Part</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Part Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Front Brake Pads for Toyota Camry"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the condition, compatibility, and any additional details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-make">Car Make *</Label>
              <Input
                id="edit-make"
                value={formData.make}
                onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-model">Car Model *</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Camry"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-year">Year *</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Part Type *</Label>
              <Select 
                value={formData.part_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, part_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select part type" />
                </SelectTrigger>
                <SelectContent>
                  {CAR_PART_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition *</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">Price (GHS) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="150.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Location/Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Accra, Greater Accra"
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Part Photos</Label>
            <PhotoUpload onPhotoChange={handlePhotoChange} currentPhoto={currentPhoto} />
            {newImages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {newImages.length} new photo{newImages.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Updating...' : 'Update Part'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPartModal;