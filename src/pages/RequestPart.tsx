import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { checkAntiSpam, triggerNotification, triggerAiReview } from "@/utils/antiSpam";
import PhotoUpload from "@/components/PhotoUpload";

const RequestPart = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    part: '',
    description: '',
    phone: '',
    location: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a part request.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setLoading(true);
    
    try {
      // Anti-spam check
      const spamCheck = await checkAntiSpam(
        formData.phone,
        user.id,
        {
          car_make: formData.make,
          car_model: formData.model,
          part_needed: formData.part,
          description: formData.description
        }
      );

      if (!spamCheck.allowed) {
        // If it requires review, show AI review UI and process
        if (spamCheck.requiresReview) {
          setAiReviewing(true);
          toast({
            title: "Request Under Review",
            description: "Our AI is reviewing your request for approval...",
          });

          // Create request with pending status
          const requestData = await createRequest('pending');
          if (requestData) {
            // Trigger AI review
            const aiApproved = await triggerAiReview(requestData.id);
            setAiReviewing(false);
            
            if (aiApproved) {
              setSubmitted(true);
              toast({
                title: "Request Approved!",
                description: "Your request has been approved and suppliers are being notified.",
              });
              await triggerNotification('new_request', { requestId: requestData.id });
            } else {
              toast({
                title: "Request Needs Review",
                description: "Your request is being reviewed by our team. You'll be notified once approved.",
                variant: "destructive"
              });
              // Still show success but different message
              setSubmitted(true);
            }
          }
        } else {
          toast({
            title: "Request Blocked",
            description: spamCheck.message || "Your request was blocked by our spam filter.",
            variant: "destructive"
          });
        }
        setLoading(false);
        return;
      }

      // Normal flow for approved requests
      const requestData = await createRequest('pending');
      if (requestData) {
        await triggerNotification('new_request', { requestId: requestData.id });
        setSubmitted(true);
        toast({
          title: "Request Submitted!",
          description: "We're notifying suppliers in your area. You'll hear from them soon.",
        });
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAiReviewing(false);
    }
  };

  const createRequest = async (status: string = 'pending') => {
    // Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('part-photos')
        .upload(fileName, photo);

      if (uploadError) {
        console.error('Photo upload error:', uploadError);
        toast({
          title: "Photo Upload Failed",
          description: "We couldn't upload your photo, but we'll still process your request.",
          variant: "destructive"
        });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('part-photos')
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }
    }

    const { data: request, error } = await supabase
      .from('part_requests')
      .insert([
        {
          owner_id: user!.id,
          car_make: formData.make,
          car_model: formData.model,
          car_year: parseInt(formData.year),
          part_needed: formData.part,
          description: formData.description,
          location: formData.location,
          phone: formData.phone,
          photo_url: photoUrl,
          status: status
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return request;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 font-inter">
        <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-3 sm:mb-4">Request Sent!</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 font-crimson leading-relaxed">
            We've automatically notified suppliers in your area. You'll receive offers via WhatsApp soon.
          </p>
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8"
          />
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Request a Part</h1>
        </div>
      </header>

      {/* AI Review Loading */}
      {aiReviewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg animate-pulse">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-playfair font-semibold mb-2 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AI Review in Progress</h3>
            <p className="text-gray-600 text-sm font-crimson">
              Our AI is analyzing your request for approval...
            </p>
          </Card>
        </div>
      )}

      {/* Form */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Tell us what you need</h2>
            <p className="text-gray-600 text-sm sm:text-base font-crimson">We'll automatically notify suppliers in your area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="make" className="text-sm sm:text-base font-inter">Car Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g. Toyota"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  required
                  className="mt-1 text-base border-blue-200 focus:border-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="model" className="text-sm sm:text-base font-inter">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g. Corolla"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                  className="mt-1 text-base border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="year" className="text-sm sm:text-base font-inter">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g. 2015"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
                className="mt-1 text-base border-blue-200 focus:border-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="part" className="text-sm sm:text-base font-inter">Part Needed *</Label>
              <Input
                id="part"
                placeholder="e.g. Alternator, Brake Pads"
                value={formData.part}
                onChange={(e) => handleInputChange('part', e.target.value)}
                required
                className="mt-1 text-base border-blue-200 focus:border-blue-400"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm sm:text-base font-inter">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Any specific details about the part..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="mt-1 resize-none text-base border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="location" className="text-sm sm:text-base font-inter">Your Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Accra, Kumasi"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="mt-1 text-base border-blue-200 focus:border-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base font-inter">Phone/WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +233 20 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="mt-1 text-base border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm sm:text-base font-inter">Upload Photo (Optional)</Label>
              <div className="mt-1">
                <PhotoUpload
                  currentPhoto={photo}
                  onPhotoChange={handlePhotoChange}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-2.5 sm:py-3 lg:py-4 text-base sm:text-lg rounded-xl mt-6 font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading || aiReviewing}
            >
              {loading ? 'Submitting...' : aiReviewing ? 'AI Reviewing...' : 'Send Request'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default RequestPart;
