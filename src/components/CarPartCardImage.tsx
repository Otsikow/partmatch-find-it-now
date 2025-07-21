
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand } from "lucide-react";
import SaveButton from "./SaveButton";
import { getConditionColor, getImageUrl } from "@/utils/carPartUtils";

interface CarPartCardImageProps {
  partId: string;
  title: string;
  condition: string;
  images?: string[];
  onExpand: () => void;
}

const CarPartCardImage = ({ partId, title, condition, images, onExpand }: CarPartCardImageProps) => {
  const imageUrl = getImageUrl(images);
  
  return (
    <div className="relative cursor-pointer" onClick={onExpand}>
      {imageUrl ? (
        <div className="relative h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              // Show placeholder on error instead of hiding
              const target = e.currentTarget;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center hidden">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm">Image failed to load</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <SaveButton 
              partId={partId} 
              size="sm" 
              variant="ghost"
              className="bg-white/90 hover:bg-white shadow-sm"
            />
            <Badge 
              variant="secondary" 
              className={`${getConditionColor(condition)} font-semibold`}
            >
              {condition}
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2">
            <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm">No Image Available</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <SaveButton 
              partId={partId} 
              size="sm" 
              variant="ghost"
              className="bg-white/90 hover:bg-white shadow-sm"
            />
            <Badge 
              variant="secondary" 
              className={`${getConditionColor(condition)} font-semibold`}
            >
              {condition}
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2">
            <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPartCardImage;
