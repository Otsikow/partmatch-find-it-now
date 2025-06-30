
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  currentPhoto?: File | null;
  maxFreeImages?: number;
  onUpgradeRequest?: () => void;
}

const PhotoUpload = ({ 
  onPhotoChange, 
  currentPhoto, 
  maxFreeImages = 3,
  onUpgradeRequest
}: PhotoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    onPhotoChange(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    if (onUpgradeRequest) {
      onUpgradeRequest();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Photos</span>
          <Badge variant="secondary" className="text-xs">
            Up to {maxFreeImages} free
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUpgradeModal(true)}
          className="text-xs"
        >
          <CreditCard className="h-3 w-3 mr-1" />
          More Photos
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {currentPhoto ? (
        <div className="relative">
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(currentPhoto)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removePhoto}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="text-sm text-gray-600 mt-2">{currentPhoto.name}</p>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Upload a photo of your part
            </p>
            <p className="text-xs text-gray-500">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG up to 5MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              onButtonClick();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Upload More Photos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-semibold text-emerald-800 mb-2">Premium Photo Package</h3>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Upload up to 10 photos per listing</li>
                <li>• Higher resolution images</li>
                <li>• Priority listing placement</li>
                <li>• Enhanced visibility</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Premium Photos (7 extra)</span>
                <span className="text-xl font-bold text-emerald-600">GHS 10</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">One-time payment per listing</p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setShowUpgradeModal(false)}
                variant="outline" 
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Implement payment flow
                  alert('Payment integration coming soon!');
                  setShowUpgradeModal(false);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoUpload;
