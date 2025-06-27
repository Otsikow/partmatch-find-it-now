
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RequestHeader from "@/components/RequestForm/RequestHeader";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import AiReviewModal from "@/components/RequestForm/AiReviewModal";
import SuccessPage from "@/components/RequestForm/SuccessPage";
import { RequestFormData, initialFormData } from "@/components/RequestForm/RequestFormData";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import { LogIn, UserPlus } from "lucide-react";

const RequestPart = () => {
  const { user, loading } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  
  const { loading: submissionLoading, aiReviewing, submitRequest } = useRequestSubmission();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
        <RequestHeader />
        
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-8 max-w-md">
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Sign In Required
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-crimson mb-6">
                To post a request for car parts, you need to be registered and signed in.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/auth" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-3 text-base rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">Don't have an account?</p>
                <Link to="/auth" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-3 text-base rounded-xl font-inter font-medium transition-all duration-300"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ← Back to Home
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (submitted) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <RequestHeader />
      
      <AiReviewModal isVisible={aiReviewing} />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Card className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair font-semibold mb-1 sm:mb-2 md:mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Tell us what you need</h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-crimson px-2">We'll automatically notify suppliers in your area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
            <RequestFormFields
              formData={formData}
              photo={photo}
              onInputChange={handleInputChange}
              onPhotoChange={handlePhotoChange}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-2 sm:py-2.5 md:py-3 lg:py-4 text-sm sm:text-base md:text-lg rounded-xl mt-4 sm:mt-5 md:mt-6 font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={submissionLoading || aiReviewing}
            >
              {submissionLoading ? 'Submitting...' : aiReviewing ? 'AI Reviewing...' : 'Send Request'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default RequestPart;
