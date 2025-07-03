
import { useState, useRef } from "react";
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
import LocationPicker from "@/components/LocationPicker";
import { X, Camera, Upload } from "lucide-react";

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
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const maxImages = isPremium ? MAX_PREMIUM_IMAGES : MAX_FREE_IMAGES;
    const availableSlots = maxImages - photos.length;

    if (availableSlots <= 0) {
      if (!isPremium) {
        toast({
          title: "Photo Limit Reached",
          description: `You can upload up to ${MAX_FREE_IMAGES} photos for free. Upgrade to premium for more photos.`,
          variant: "destructive"
        });
        handleUpgradeRequest();
      } else {
        toast({
          title: "Maximum Photos Reached",
          description: `You can upload up to ${MAX_PREMIUM_IMAGES} photos with premium.`,
          variant: "destructive"
        });
      }
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file. Please select PNG or JPG files.`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    // Take only as many files as we have slots available
    const filesToAdd = validFiles.slice(0, availableSlots);
    setPhotos(prev => [...prev, ...filesToAdd]);

    // Clear the input
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCameraClick = async () => {
    const maxImages = isPremium ? MAX_PREMIUM_IMAGES : MAX_FREE_IMAGES;
    
    if (photos.length >= maxImages) {
      toast({
        title: "Photo limit reached",
        description: `You can upload up to ${maxImages} photos. ${isPremium ? '' : 'Upgrade to premium for more photos.'}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error: any) {
      console.error('Camera access error:', error);
      let errorMessage = 'Camera access failed. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this browser.';
      } else {
        errorMessage += 'Please try using the file upload instead.';
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      document.getElementById('file-input')?.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        setPhotos(prev => [...prev, file]);
        closeCameraModal();
        
        toast({
          title: "Photo captured",
          description: "Photo has been added to your listing.",
        });
      }
    }, 'image/jpeg', 0.8);
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const handleUpgradeRequest = () => {
    toast({
      title: "Premium Photos Available",
      description: "Pay GHS 10 to upload up to 10 photos for this listing!",
    });
    // TODO: Implement payment flow
    // For now, we'll simulate the upgrade
    // setIsPremium(true);
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
          {/* Form fields */}
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

          {/* Enhanced Photo Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({photos.length}/{maxImages})
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Up to {MAX_FREE_IMAGES} free
                </Badge>
                {isPremium && (
                  <Badge className="text-xs bg-emerald-100 text-emerald-800">
                    Premium Active
                  </Badge>
                )}
                {!isPremium && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUpgradeRequest}
                    className="text-xs"
                  >
                    Upgrade for GHS 10
                  </Button>
                )}
              </div>
            </div>
            
            {/* Photo Upload Area */}
            {photos.length < maxImages && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Add photos of your part
                  </p>
                  <p className="text-xs text-gray-500">
                    Take a photo or upload from gallery
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG up to 5MB each
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 mt-4 justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="file-input"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCameraClick}
                    disabled={isCapturing}
                    className="min-h-[44px]"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isCapturing ? 'Opening Camera...' : 'Take Photo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="min-h-[44px]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            )}
            
            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 md:h-28 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 min-h-[32px] min-w-[32px]"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Photo limits info */}
            <div className="mt-2 text-xs text-gray-500">
              {photos.length >= MAX_FREE_IMAGES && !isPremium && (
                <p className="text-amber-600">
                  Free limit reached. Upgrade to add {MAX_PREMIUM_IMAGES - MAX_FREE_IMAGES} more photos.
                </p>
              )}
              {isPremium && photos.length >= MAX_PREMIUM_IMAGES && (
                <p className="text-gray-600">Maximum photos reached.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col tablet:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 min-h-[44px] tablet:order-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 min-h-[44px] tablet:order-2">
              {isSubmitting ? "Posting..." : "Post Part"}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={closeCameraModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Take Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={closeCameraModal}
                variant="outline" 
                className="flex-1 min-h-[44px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={capturePhoto}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 min-h-[44px]"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PostPartModal;
