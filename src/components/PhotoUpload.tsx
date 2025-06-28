
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  currentPhoto?: File | null;
}

const PhotoUpload = ({ onPhotoChange, currentPhoto }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use the upload option.');
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        handleFileSelect(file);
      }
    }, 'image/jpeg', 0.8);

    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isCapturing) {
    return (
      <div className="space-y-3">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            <Button
              type="button"
              onClick={capturePhoto}
              className="bg-white text-black hover:bg-gray-100 rounded-full h-12 w-12 p-0"
            >
              <Camera className="h-6 w-6" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopCamera}
              className="bg-white/90 text-black hover:bg-white rounded-full h-12 w-12 p-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

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
              onClick={startCamera}
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

      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PhotoUpload;
