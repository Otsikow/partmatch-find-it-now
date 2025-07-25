
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand } from "lucide-react";
import SaveButton from "./SaveButton";
import { getConditionColor, getImageUrl } from "@/utils/carPartUtils";

import { Star } from "lucide-react";

interface CarPartCardImageProps {
  partId: string;
  title: string;
  condition: string;
  images?: string[];
  isFeatured?: boolean;
  onExpand: () => void;
}

const CarPartCardImage = ({ partId, title, condition, images, isFeatured, onExpand }: CarPartCardImageProps) => {
  const imageUrl = getImageUrl(images);
  
  return (
    <div className="relative cursor-pointer group" onClick={onExpand}>
      {imageUrl ? (
        <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
feat/dashboard-button

main
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
feat/dashboard-button

main
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
feat/dashboard-button

          {/* Bottom Right - Expand Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
          
          {/* Bottom Right - Expand Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              size="sm" 
              variant="secondary" 
main
              className="bg-white/95 hover:bg-white shadow-lg border border-white/20 backdrop-blur-sm h-8 w-8 p-0"
            >
              <Expand className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden">
          <div className="text-gray-400 text-center">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-sm font-medium">No Image Available</p>
          </div>
feat/dashboard-button

main
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
feat/dashboard-button

main
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
feat/dashboard-button

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

export default CarPartCardImage;
