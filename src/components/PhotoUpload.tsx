
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  currentPhoto?: File | null;
}

const PhotoUpload = ({ onPhotoChange, currentPhoto }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoChange(file);
    } else {
      setPreview(null);
      onPhotoChange(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-white/50 to-blue-50/30">
          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-gray-600 font-crimson mb-3">
            Upload or take a photo of the part
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              Upload Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCameraClick}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              Take Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Part preview"
            className="w-full h-48 object-cover rounded-lg border border-blue-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemovePhoto}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;
