import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import useListingDraft from "@/hooks/useListingDraft";
import { supabase } from "@/integrations/supabase/client";
import { Package, Upload, AlertCircle, ArrowLeft, MapPin } from "lucide-react";
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
  city: string;
  country: string;
  currency: string;
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
  city: "",
  country: "",
  currency: "GHS",
  images: [],
};

const PostPart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  const { formData, setFormData, draftExists, loadDraft, clearDraft } =
    useListingDraft<PostPartFormData>("post-part", initialFormData);

  useEffect(() => {
    const guestDraftKey = "listing-draft-post-part-guest";
    const guestDraft = localStorage.getItem(guestDraftKey);
    console.log("PostPart: user", user);
    console.log("PostPart: guestDraft", guestDraft);
    console.log("PostPart: draftExists", draftExists);

    if (user && guestDraft) {
      console.log("PostPart: loading guest draft");
      loadDraft();
      localStorage.removeItem(guestDraftKey);
    } else if (draftExists) {
      console.log("PostPart: showing draft prompt");
      setShowDraftPrompt(true);
    }
  }, [draftExists, user, loadDraft]);

  const handleContinueDraft = () => {
    loadDraft();
    setShowDraftPrompt(false);
  };

  const handleStartNew = () => {
    clearDraft();
    setFormData(initialFormData);
    setShowDraftPrompt(false);
  };

  // Auto-detect location
  useEffect(() => {
    if (!formData.address) {
      const detectLocation = async () => {
        try {
          // Try geolocation first
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                  // Use a more reliable reverse geocoding service
                  const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
                  );
                  
                  const data = await response.json();
                  const result = data?.results?.[0];
                  
                  if (result) {
                    const components = result.components;
                    const city = components.city || components.town || components.village || "Accra";
                    const state = components.state || "";
                    const country = components.country || "Ghana";
                    const countryCode = components["ISO_3166-1_alpha-2"] || "GH";
                    
                    // Currency mapping based on country code
                    const currencyMap: Record<string, string> = {
                      GH: "GHS", NG: "NGN", KE: "KES", ZA: "ZAR",
                      US: "USD", GB: "GBP", CA: "CAD", IN: "INR", PK: "PKR",
                    };
                    
                    const detectedCurrency = currencyMap[countryCode] || "GHS";
                    const detectedAddress = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
                    
                    setFormData((prev) => ({
                      ...prev,
                      address: detectedAddress,
                      city,
                      country,
                      currency: detectedCurrency
                    }));
                    setLocationDetected(true);
                  }
                } catch (geocodeError) {
                  console.error("Reverse geocoding failed:", geocodeError);
                  // Fallback to IP-based detection
                  await fallbackToIPLocation();
                }
              },
              async (error) => {
                console.warn("Geolocation error:", error.message);
                // Fallback to IP-based detection
                await fallbackToIPLocation();
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
            );
          } else {
            // No geolocation support, use IP-based detection
            await fallbackToIPLocation();
          }
        } catch (error) {
          console.error("Location detection failed:", error);
          // Final fallback to default Ghana
          setDefaultLocation();
        }
      };

      const fallbackToIPLocation = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data && data.city && data.country_name) {
            const currencyMap: Record<string, string> = {
              GH: "GHS", NG: "NGN", KE: "KES", ZA: "ZAR",
              US: "USD", GB: "GBP", CA: "CAD", IN: "INR", PK: "PKR",
            };
            
            const detectedCurrency = currencyMap[data.country_code] || "GHS";
            const detectedAddress = `${data.city}, ${data.country_name}`;
            
            setFormData((prev) => ({
              ...prev,
              address: detectedAddress,
              city: data.city,
              country: data.country_name,
              currency: detectedCurrency
            }));
            setLocationDetected(true);
          } else {
            setDefaultLocation();
          }
        } catch (error) {
          console.error("IP location detection failed:", error);
          setDefaultLocation();
        }
      };

      const setDefaultLocation = () => {
        setFormData((prev) => ({
            ...prev,
            address: "Accra, Ghana",
            city: "Accra",
            country: "Ghana",
            currency: "GHS"
        }));
        setLocationDetected(true);
      };

      detectLocation();
    }
  }, [formData.address, setFormData]);

  const handleInputChange = (field: keyof PostPartFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        currency: data.currency,
        address: data.address.trim(),
        city: data.city.trim(),
        country: data.country.trim(),
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
      clearDraft();
      setFormData(initialFormData);
      
      // Redirect to success page or dashboard
      navigate('/listing-success');

    } catch (error: any) {
      console.error("Error posting part:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        if (error.message.includes("duplicate key value violates unique constraint")) {
          errorMessage = "This part seems to be a duplicate of another listing. Please check your inventory.";
        } else if (error.message.includes("network error")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Posting Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Save current form data to guest draft before redirecting to login
      const guestDraftKey = "listing-draft-post-part-guest";
      localStorage.setItem(guestDraftKey, JSON.stringify(formData));
      toast({
        title: "Draft Saved",
        description: "Your listing has been saved. Sign in to continue posting.",
      });
      navigate('/seller-auth?redirect=/post-part');
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
              <Link to="/" className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-white/30 transition-colors">
                <img 
                  src="/lovable-uploads/02ae2c2c-72fd-4678-8cef-3158e8e313f0.png" 
                  alt="PartMatch Logo" 
                  className="h-6 w-auto sm:h-8 object-contain rounded-lg"
                />
              </Link>
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

      <main className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Package className="h-6 w-6" />
              Post Your Car Part
              {(draftExists || formData.title) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearDraft();
                    setFormData(initialFormData);
                    toast({
                      title: "Draft Cleared",
                      description: "Form has been reset to start fresh.",
                    });
                  }}
                  className="ml-auto"
                >
                  🗑 Clear Draft
                </Button>
              )}
            </CardTitle>
            <p className="text-muted-foreground">
              Fill in the details below to list your car part for sale.
              {draftExists && " (Draft restored)"}
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

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price ({formData.currency || 'GHS'}) *</Label>
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

              {/* Auto-detected Location Display */}
              <div className="space-y-2">
                <Label>Location *</Label>
                <div className="p-3 bg-muted rounded-md border">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        {formData.address || 'Detecting location...'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Location and currency ({formData.currency || 'GHS'}) detected automatically. 
                    {locationDetected && ' ✓ Detection complete'}
                  </p>
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