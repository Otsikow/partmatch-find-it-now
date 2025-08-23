import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, X, FileText, AlertCircle, CheckCircle, Camera } from 'lucide-react';

interface VerificationFileUploadProps {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  helpText?: string;
  maxSize?: number; // in MB
}

const VerificationFileUpload = ({
  label,
  required = false,
  file,
  onChange,
  accept = "image/*,.pdf",
  helpText,
  maxSize = 10
}: VerificationFileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      if (type === '.pdf') {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Please select a valid file type. Accepted: ${accept}`;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB. Current size: ${formatFileSize(file.size)}`;
    }

    return null;
  };

  const handleFile = async (selectedFile: File) => {
    setUploadError(null);
    
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setUploadError(validationError);
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onChange(selectedFile);
      
      toast({
        title: "File Selected",
        description: `${selectedFile.name} is ready for upload`,
      });
    } catch (error: any) {
      console.error('File selection error:', error);
      setUploadError(error.message || 'Failed to select file');
      toast({
        title: "File Selection Failed",
        description: error.message || 'Failed to select file. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    setUploadError(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-muted-foreground" />;
    
    if (file.type.startsWith('image/')) {
      return <img 
        src={URL.createObjectURL(file)} 
        alt="Preview" 
        className="h-16 w-16 object-cover rounded border"
      />;
    }
    
    return <FileText className="h-12 w-12 text-blue-600" />;
  };

  const getStatusIcon = () => {
    if (uploadError) return <AlertCircle className="h-5 w-5 text-destructive" />;
    if (file && !isUploading) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {getStatusIcon()}
      </div>
      
      {helpText && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">{helpText}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
      />

      {file ? (
        <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    Processing... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isUploading}
              className="text-gray-500 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/5"
              : uploadError
              ? "border-destructive bg-destructive/5"
              : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center gap-3">
            {getFileIcon()}
            <div>
              <p className="text-sm font-medium">
                {dragActive ? "Drop file here" : "Upload a file"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                {accept === "image/*,.pdf" ? "PNG, JPG, PDF" : accept} up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default VerificationFileUpload;