import { MapPin, Phone, Clock } from "lucide-react";

interface RequestCardMetadataProps {
  location: string;
  phone: string;
  createdAt: string;
}

const RequestCardMetadata = ({ location, phone, createdAt }: RequestCardMetadataProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-orange-500" />
        <span className="font-medium">{location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-orange-500" />
        <span className="font-medium">{phone}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <span>{formatDate(createdAt)}</span>
      </div>
    </div>
  );
};

export default RequestCardMetadata;