import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import { RequestFormData, initialFormData } from "@/components/RequestForm/RequestFormData";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Home, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const RequestPart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading: submissionLoading,
    aiReviewing,
    submitRequest,
  } = useRequestSubmission();
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [photo, setPhoto] = useState<File | null>(null);

  // Auto-populate user details for signed-in users
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, location')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            email: user.email || '',
            phone: profile.phone || '',
            location: profile.location || ''
          }));
        } else {
          // Fallback to using just the email if no profile found
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submitRequest(formData, photo);
    if (result.success) {
      navigate("/request-success");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
      {/* Custom Responsive Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Left section with back button, logo and title */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/20 rounded-full text-white hover:text-white flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
                <img 
                  src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png" 
                  alt="PartMatch - Car Parts Marketplace" 
                  className="h-8 w-auto sm:h-10 object-contain" 
                />
              </Link>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
                  {t("requestPart.welcomeTitle", "Find Your Car Part")}
                </h1>
                <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
                  {t("requestPart.subtitle", "Tell us what you need and we'll connect you with verified sellers")}
                </p>
              </div>
            </div>
            
            {/* Right section with action buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                <Home className="h-4 w-4 drop-shadow-md" />
                <span className="hidden sm:inline font-medium">Home</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 text-white hover:bg-white/30 hover:text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20"
              >
                <X className="h-4 w-4 drop-shadow-md" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <RequestFormFields
            formData={formData}
            photo={photo}
            onInputChange={handleInputChange}
            onPhotoChange={handlePhotoChange}
          />

          <Button
            type="submit"
            disabled={submissionLoading || aiReviewing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submissionLoading || aiReviewing
              ? t("requestPart.submitting", "Submitting...")
              : t("requestPart.submitRequest", "Submit Request")}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RequestPart;
