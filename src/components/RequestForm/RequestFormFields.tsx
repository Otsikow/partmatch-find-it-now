
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhotoUpload from "@/components/PhotoUpload";
import LocationSelector from "@/components/LocationSelector";
import { RequestFormData } from "./RequestFormData";

interface RequestFormFieldsProps {
  formData: RequestFormData;
  photo: File | null;
  onInputChange: (field: string, value: string) => void;
  onPhotoChange: (file: File | null) => void;
}

const RequestFormFields = ({ formData, photo, onInputChange, onPhotoChange }: RequestFormFieldsProps) => {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="make" className="text-sm sm:text-base font-inter">Car Make *</Label>
          <Input
            id="make"
            placeholder="e.g. Toyota"
            value={formData.make}
            onChange={(e) => onInputChange('make', e.target.value)}
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
            onChange={(e) => onInputChange('model', e.target.value)}
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
          onChange={(e) => onInputChange('year', e.target.value)}
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
          onChange={(e) => onInputChange('part', e.target.value)}
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
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
          className="mt-1 resize-none text-base border-blue-200 focus:border-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <LocationSelector
            value={formData.location}
            onChange={(value) => onInputChange('location', value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm sm:text-base font-inter">Phone/WhatsApp *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +233 20 123 4567"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
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
            onPhotoChange={onPhotoChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestFormFields;
