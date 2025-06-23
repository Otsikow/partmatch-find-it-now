
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RequestHeader from "@/components/RequestForm/RequestHeader";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import AiReviewModal from "@/components/RequestForm/AiReviewModal";
import SuccessPage from "@/components/RequestForm/SuccessPage";
import { RequestFormData, initialFormData } from "@/components/RequestForm/RequestFormData";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";

const RequestPart = () => {
  const [submitted, setSubmitted] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  
  const { loading, aiReviewing, submitRequest } = useRequestSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitRequest(formData, photo);
    if (result.success) {
      setSubmitted(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  if (submitted) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <RequestHeader />
      
      <AiReviewModal isVisible={aiReviewing} />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Tell us what you need</h2>
            <p className="text-gray-600 text-sm sm:text-base font-crimson">We'll automatically notify suppliers in your area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
            <RequestFormFields
              formData={formData}
              photo={photo}
              onInputChange={handleInputChange}
              onPhotoChange={handlePhotoChange}
            />

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
