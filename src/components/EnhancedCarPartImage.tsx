import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Wand2, Image as ImageIcon } from "lucide-react";
import SaveButton from "./SaveButton";
import { getConditionColor, getImageUrl } from "@/utils/carPartUtils";
import { Star } from "lucide-react";
import { createProductImage, loadImageFromUrl } from "@/utils/backgroundRemoval";
import { toast } from "@/hooks/use-toast";
import { useImageEnhancement } from "@/contexts/ImageEnhancementContext";

interface EnhancedCarPartImageProps {
  partId: string;
  title: string;
  condition: string;
  images?: string[];
  isFeatured?: boolean;
  onExpand: () => void;
}

const EnhancedCarPartImage = ({ 
  partId, 
  title, 
  condition, 
  images, 
  isFeatured, 
  onExpand 
}: EnhancedCarPartImageProps) => {
  const { backgroundRemovalEnabled } = useImageEnhancement();
  const imageUrl = getImageUrl(images);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const processingRef = useRef(false);

  useEffect(() => {
    if (backgroundRemovalEnabled && imageUrl && !processingRef.current) {
      processingRef.current = true;
      processImage();
    }
  }, [imageUrl, backgroundRemovalEnabled]);

  const processImage = async () => {
    if (!imageUrl) return;
    
    try {
      setIsProcessing(true);
      console.log('🔄 Processing car part image for professional display...');
      
      // Load the original image
      const originalImage = await loadImageFromUrl(imageUrl);
      
      // Create professional product image with background removal
      const processedBlob = await createProductImage(originalImage);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImageUrl(processedUrl);
      setShowOriginal(false); // Switch to processed image by default
      
      console.log('✅ Car part image processed successfully');
    } catch (error) {
      console.error('Failed to process image:', error);
      // Silently fall back to original image
      setShowOriginal(true);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  };

  const toggleImageVersion = () => {
    setShowOriginal(!showOriginal);
  };

  const currentImageUrl = showOriginal ? imageUrl : (processedImageUrl || imageUrl);
  
  return (
    <div className="relative cursor-pointer group" onClick={onExpand}>
      {currentImageUrl ? (
        <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-lg">
          <img
            src={currentImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            style={{
              filter: showOriginal ? 'none' : 'brightness(1.05) contrast(1.02)',
            }}
            onError={(e) => {
              console.error('Image failed to load:', currentImageUrl);
              const target = e.currentTarget;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
            loading="lazy"
          />
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Enhancing...</span>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center hidden">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm">Image failed to load</p>
            </div>
          </div>
          
          {/* Top Left - Featured Badge */}
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="default"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold text-xs px-2 py-1 shadow-md"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
          
          {/* Top Right - Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
            <SaveButton 
              partId={partId} 
              size="sm" 
              variant="ghost"
              className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
            />
            
            {/* Image toggle button */}
            {processedImageUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleImageVersion();
                }}
                className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
                title={showOriginal ? "Show enhanced image" : "Show original image"}
              >
                {showOriginal ? <Wand2 className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
              </Button>
            )}
            
            <Badge 
              variant="secondary" 
              className={`${getConditionColor(condition)} font-medium text-xs px-2 py-1 shadow-md backdrop-blur-sm bg-white/95`}
            >
              {condition}
            </Badge>
          </div>
          
          {/* Bottom Right - Expand Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
            >
              <Expand className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {/* Enhancement indicator */}
          {!showOriginal && processedImageUrl && (
            <div className="absolute bottom-2 left-2 opacity-80">
              <Badge 
                variant="secondary" 
                className="bg-emerald-500/90 text-white font-medium text-xs px-2 py-1 shadow-md backdrop-blur-sm"
              >
                ✨ Enhanced
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden">
          <div className="text-gray-400 text-center">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-sm font-medium">No Image Available</p>
          </div>
          
          {/* Top Left - Featured Badge */}
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="default"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold text-xs px-2 py-1 shadow-md"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
          
          {/* Top Right - Save Button and Condition */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
            <SaveButton 
              partId={partId} 
              size="sm" 
              variant="ghost"
              className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
            />
            <Badge 
              variant="secondary" 
              className={`${getConditionColor(condition)} font-medium text-xs px-2 py-1 shadow-md backdrop-blur-sm bg-white/95`}
            >
              {condition}
            </Badge>
          </div>
          
          {/* Bottom Right - Expand Button */}
          <div className="absolute bottom-2 right-2 opacity-70 hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
            >
              <Expand className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCarPartImage;