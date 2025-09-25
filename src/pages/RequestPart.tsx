import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import RequestPartHeroSection from "@/components/RequestPartHeroSection";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import { RequestFormData, initialFormData } from "@/components/RequestForm/RequestFormData";
import { Button } from "@/components/ui/button";
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
      {/* Hero Section */}
      <RequestPartHeroSection />

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
