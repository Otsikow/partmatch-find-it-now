
import { useState } from "react";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import PageHeader from "@/components/PageHeader";
import { RequestFormData } from "@/components/RequestForm/RequestFormData";
import { Button } from "@/components/ui/button";

const RequestPart = () => {
  const { loading, aiReviewing, submitRequest } = useRequestSubmission();
  const [formData, setFormData] = useState<RequestFormData>({
    make: "",
    model: "",
    year: "",
    part: "",
    description: "",
    location: "",
    phone: ""
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest(formData, photo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Request Car Part"
        subtitle="Tell us what you need and we'll connect you with suppliers"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <RequestFormFields 
            formData={formData}
            photo={photo}
            onInputChange={handleInputChange}
            onPhotoChange={handlePhotoChange}
          />
          
          <Button
            type="submit"
            disabled={loading || aiReviewing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading || aiReviewing ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RequestPart;
