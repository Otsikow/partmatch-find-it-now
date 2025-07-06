import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[] | any;
  title: string;
  className?: string;
}

const ImageGallery = ({ images, title, className = "" }: ImageGalleryProps) => {
  // Handle different image data formats and filter out invalid images
  const validImages = useMemo(() => {
    if (!images) return [];
    
    // If images is not an array (could be an object or undefined), return empty array
    if (!Array.isArray(images)) {
      console.warn('Images is not an array:', images);
      return [];
    }
    
    // Filter out invalid image URLs
    return images.filter(img => 
      typeof img === 'string' && 
      img.trim() !== '' && 
      (img.startsWith('http') || img.startsWith('data:'))
    );
  }, [images]);

  const [current, setCurrent] = useState(0);

  // Reset current index if it's out of bounds
  if (current >= validImages.length && validImages.length > 0) {
    setCurrent(0);
  }

  const goNext = () => setCurrent((prev) => (prev + 1) % validImages.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + validImages.length) % validImages.length);

  if (!validImages || validImages.length === 0) return null;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Main Image Display */}
      <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100">
        <img
          src={validImages[current]}
          alt={`${title} - Image ${current + 1}`}
          className="w-full max-h-96 object-cover"
        />
        
        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              onClick={goPrev}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={goNext}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {current + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {validImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${title} thumbnail ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`flex-shrink-0 w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                current === index 
                  ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                  : 'hover:opacity-80 border-2 border-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;