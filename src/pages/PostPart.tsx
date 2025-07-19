import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Upload, AlertCircle, ArrowLeft } from "lucide-react";
import { CAR_PART_CATEGORIES } from "@/constants/carPartCategories";

interface PostPartFormData {
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

const initialFormData: PostPartFormData = {
  title: "",
  description: "",
  make: "",
  model: "",
  year: "",
  partType: "",
  condition: "",
  price: "",
  address: "",
  images: [],
};

const PostPart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [formData, setFormData] = useState<PostPartFormData>(initialFormData);

  // Auto-detect location and load saved draft
  useEffect(() => {
    // Load saved draft from localStorage
    const savedDraft = localStorage.getItem('draftPart');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
      } catch (error) {
        console.error('Failed to parse saved draft:', error);
        localStorage.removeItem('draftPart');
      }
    }

    // Auto-detect location
    const detectLocation = async () => {
      try {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
              );

              const data = await response.json();
              const result = data?.results?.[0];

              if (result) {
                const components = result.components;
                const city = components.city || components.town || components.village || "";
                const state = components.state || "";
                const country = components.country || "";
                const countryCode = components["ISO_3166-1_alpha-2"] || "";

                const currencyMap: Record<string, string> = {
                  GH: "GHS", NG: "NGN", KE: "KES", ZA: "ZAR",
                  US: "USD", GB: "GBP", CA: "CAD", IN: "INR", PK: "PKR",
                };

                const detectedCurrency = currencyMap[countryCode] || "USD";
                const detectedAddress = `${city}, ${state}, ${country}`;

                setFormData((prev) => ({
                  ...prev,
                  address: prev.address || detectedAddress,
                }));
                setCurrency(detectedCurrency);
              }
            } catch (err) {
              console.error("Failed to reverse geocode:", err);
            }
          },
          (error) => console.warn("Geolocation error:", error.message),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch (error) {
        console.error("Location detection failed:", error);
      }
    };

    detectLocation();
  }, []);

  // Handle auto-submission after login
  useEffect(() => {
    const autoSubmit = searchParams.get('autoSubmit');
    if (autoSubmit === 'true' && user) {
      const savedDraft = localStorage.getItem('draftPart');
      if (savedDraft) {
        console.log('Auto-submitting saved draft:', savedDraft);
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setFormData(parsedDraft);
          // Auto-submit after a short delay to ensure form is loaded
          setTimeout(() => {
            submitListing(parsedDraft);
          }, 500);
        } catch (error) {
          console.error('Failed to auto-submit:', error);
          toast({
            title: "Auto-submission Failed",
            description: "Please review and submit your listing manually.",
            variant: "destructive",
          });
        }
      }
    }
  }, [user, searchParams]);

  const handleInputChange = (field: keyof PostPartFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Save to localStorage as user types
    localStorage.setItem('draftPart', JSON.stringify(updatedData));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedData = { ...formData, images: [...formData.images, ...files] };
      setFormData(updatedData);
      localStorage.setItem('draftPart', JSON.stringify(updatedData));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedData = { ...formData, images: updatedImages };
    setFormData(updatedData);
    localStorage.setItem('draftPart', JSON.stringify(updatedData));
  };

  const submitListing = async (data: PostPartFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post car parts.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate required fields
      if (!data.title || !data.make || !data.model || !data.year || 
          !data.partType || !data.condition || !data.price || !data.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const price = parseFloat(data.price);
      const year = parseInt(data.year);

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
        toast({
          title: "Invalid Year",
          description: "Please enter a valid year.",
          variant: "destructive",
        });
        return;
      }

      // Upload images
      let imageUrls: string[] = [];
      if (data.images.length > 0) {
        try {
          const uploadPromises = data.images.map(async (photo, index) => {
            const timestamp = Date.now();
            const fileName = `${user.id}/${timestamp}-${index}.${photo.name.split(".").pop()}`;

            const { error } = await supabase.storage
              .from("car-part-images")
              .upload(fileName, photo);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
              .from("car-part-images")
              .getPublicUrl(fileName);

            return publicUrl;
          });

          imageUrls = await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload images. Posting without images.",
            variant: "destructive",
          });
        }
      }

      // Insert part data
      const partData = {
        supplier_id: user.id,
        title: data.title.trim(),
        description: data.description.trim() || null,
        make: data.make.trim(),
        model: data.model.trim(),
        year: year,
        part_type: data.partType,
        condition: data.condition,
        price: price,
        currency: currency,
        address: data.address.trim(),
        images: imageUrls.length > 0 ? imageUrls : null,
        status: "available",
      };

      const { error } = await supabase
        .from("car_parts")
        .insert([partData]);

      if (error) throw error;

      toast({
        title: "Part Posted Successfully!",
        description: "Your car part has been posted and is now available for buyers.",
      });

      // Clear localStorage and form
      localStorage.removeItem('draftPart');
      setFormData(initialFormData);
      
      // Redirect to success page or dashboard
      navigate('/listing-success');

    } catch (error: any) {
      console.error("Error posting part:", error);
      toast({
        title: "Posting Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Save form data and redirect to seller login
      localStorage.setItem('draftPart', JSON.stringify(formData));
      navigate('/seller-auth?redirect=/post-part&autoSubmit=true');
      return;
    }

    await submitListing(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary-foreground text-white shadow-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/20 rounded-full text-white hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Post Car Part
                </h1>
                <p className="text-sm sm:text-base text-white/90">
                  List your car parts for sale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Package className="h-6 w-6" />
              Post Your Car Part
            </CardTitle>
            <p className="text-muted-foreground">
              Fill in the details below to list your car part for sale.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Part Title */}
              <div>
                <Label htmlFor="title">Part Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Front Brake Pads for Toyota Camry"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Car Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
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
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              {/* Part Type and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Part Type *</Label>
                  <Select
                    value={formData.partType}
                    onValueChange={(value) => handleInputChange("partType", value)}
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
                    onValueChange={(value) => handleInputChange("condition", value)}
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

              {/* Price and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ({currency}) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Location *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="City, State, Country"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="images">Part Images</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                  />
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Part image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Authentication Notice */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Just one step away – sign in to post your part.
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        We've saved your listing. It'll go live immediately after login.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Posting..."
                  : user
                  ? "Post Listing"
                  : "Sign In & Post Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostPart;