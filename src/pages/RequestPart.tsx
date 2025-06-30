
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import PageHeader from "@/components/PageHeader";

const RequestPart = () => {
  const { handleSubmit, isSubmitting } = useRequestSubmission();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Request Car Part"
        subtitle="Tell us what you need and we'll connect you with suppliers"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <RequestFormFields onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
};

export default RequestPart;
