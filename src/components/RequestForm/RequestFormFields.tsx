
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PhotoUpload from "@/components/PhotoUpload";
import { useAuth } from "@/contexts/AuthContext";

interface RequestFormFieldsProps {
  formData: {
    make: string;
    model: string;
    year: string;
    part: string;
    description: string;
    location: string;
    phone: string;
    name: string;
    email: string;
  };
  photo: File | null;
  onInputChange: (field: string, value: string) => void;
  onPhotoChange: (file: File | null) => void;
}

const RequestFormFields = ({ 
  formData, 
  photo, 
  onInputChange, 
  onPhotoChange 
}: RequestFormFieldsProps) => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="make">Car Make *</Label>
            <Input
              id="make"
              type="text"
              placeholder="e.g., Toyota, Honda"
              value={formData.make}
              onChange={(e) => onInputChange('make', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="model">Car Model *</Label>
            <Input
              id="model"
              type="text"
              placeholder="e.g., Corolla, Civic"
              value={formData.model}
              onChange={(e) => onInputChange('model', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g., 2020"
              value={formData.year}
              onChange={(e) => onInputChange('year', e.target.value)}
              min="1990"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="part">Part Needed *</Label>
            <Input
              id="part"
              type="text"
              placeholder="e.g., Front bumper, Headlight"
              value={formData.part}
              onChange={(e) => onInputChange('part', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the part condition, specific requirements, etc."
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <PhotoUpload
          onPhotoChange={onPhotoChange}
          currentPhoto={photo}
          maxFreeImages={1}
        />
      </div>

      {/* Only show user information fields if user is not signed in */}
      {!user && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +233 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Accra, Kumasi"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Show a different section for signed-in users */}
      {user && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +233 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Accra, Kumasi"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ Signed in as <strong>{user.email}</strong>. Your account details will be used for this request.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestFormFields;
