import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Star } from "lucide-react";
import SaveButton from "./SaveButton";
import { getConditionColor, getImageUrl } from "@/utils/carPartUtils";

interface CarPartCardImageProps {
  partId: string;
  title: string;
  condition: string;
  images?: string[];
  isFeatured?: boolean;
  onExpand: () => void;
}

export const CarPartCardImage = ({
  partId,
  title,
  condition,
  images,
  isFeatured,
  onExpand,
}: CarPartCardImageProps) => {
  const imageUrl = getImageUrl(images);

  return (
    <div className="relative cursor-pointer group overflow-hidden" onClick={onExpand}>
      {imageUrl ? (
        <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 bg-muted overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
            loading="lazy"
          />
          {/* Fallback image container */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 items-center justify-center hidden flex-col p-4 text-center">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Image unavailable</p>
          </div>

          {/* Top Left - Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className="bg-amber-500/90 hover:bg-amber-500 text-white font-semibold text-xs px-2.5 py-1 shadow-md border-0 backdrop-blur-md"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Top Right - Save Button and Condition */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
            <SaveButton
              partId={partId}
              size="sm"
              variant="ghost"
              className="bg-background/80 hover:bg-background text-foreground shadow-sm border border-border/20 backdrop-blur-md h-9 w-9 p-0 rounded-full"
            />
            <Badge
              variant="secondary"
              className={`${getConditionColor(
                condition
              )} font-medium text-xs px-2.5 py-1 shadow-sm backdrop-blur-md bg-background/85 border border-border/20 rounded-full`}
            >
              {condition}
            </Badge>
          </div>

          {/* Bottom Right - Expand / Inspect Button */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-background/90 hover:bg-background text-foreground shadow-md border border-border/20 backdrop-blur-md h-9 w-9 p-0 rounded-full"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 bg-gradient-to-br from-muted via-muted/90 to-muted/80 flex items-center justify-center rounded-t-2xl overflow-hidden">
          <div className="text-muted-foreground text-center p-4">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm font-medium">No Image Available</p>
          </div>

          {/* Top Left - Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className="bg-amber-500/90 text-white font-semibold text-xs px-2.5 py-1 shadow-md backdrop-blur-md"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Top Right - Save Button and Condition */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
            <SaveButton
              partId={partId}
              size="sm"
              variant="ghost"
              className="bg-background/80 hover:bg-background text-foreground shadow-sm border border-border/20 backdrop-blur-md h-9 w-9 p-0 rounded-full"
            />
            <Badge
              variant="secondary"
              className={`${getConditionColor(
                condition
              )} font-medium text-xs px-2.5 py-1 shadow-sm backdrop-blur-md bg-background/85 border border-border/20 rounded-full`}
            >
              {condition}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPartCardImage;
