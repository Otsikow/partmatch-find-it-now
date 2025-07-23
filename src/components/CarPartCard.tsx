
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { useState, useEffect } from "react";
import { useListingAnalytics } from "@/hooks/useListingAnalytics";
import CarPartCardImage from "./CarPartCardImage";
import CarPartCardContent from "./CarPartCardContent";
import CarPartCardFooter from "./CarPartCardFooter";
import CarPartExpandedDialog from "./CarPartExpandedDialog";

interface CarPartCardProps {
  part: CarPart;
  onContact?: () => void;
}

const CarPartCard = ({ part, onContact }: CarPartCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const { trackListingView, trackListingClick } = useListingAnalytics();

  // Track view when component mounts
  useEffect(() => {
    trackListingView(part.id);
  }, [part.id, trackListingView]);

  const handleCardClick = () => {
    trackListingClick(part.id, 'card_click');
    setIsExpanded(true);
  };

  const handleContactClick = () => {
    trackListingClick(part.id, 'contact_click');
    if (onContact) onContact();
  };

  const handleToggleCollapsible = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsibleOpen(!isCollapsibleOpen);
  };

  return (
    <>
      <Card className="w-full bg-card shadow-md hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
        <CarPartCardImage
          partId={part.id}
          title={part.title}
          condition={part.condition}
          images={part.images}
          isFeatured={part.is_featured}
          onExpand={handleCardClick}
        />

        <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
          {/* Always visible basic info */}
          <div className="cursor-pointer" onClick={handleCardClick}>
            <CarPartCardContent
              part={part}
              onExpand={handleCardClick}
            />
          </div>

          {/* Collapsible trigger */}
          <div className="px-4 pb-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={handleToggleCollapsible}
              >
                {isCollapsibleOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Collapsible footer with action buttons */}
          <CollapsibleContent>
            <CarPartCardFooter
              partId={part.id}
              supplierId={part.supplier_id}
              onContact={handleContactClick}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <CarPartExpandedDialog
        part={part}
        isOpen={isExpanded}
        onOpenChange={setIsExpanded}
        onContact={onContact}
      />
    </>
  );
};

export default CarPartCard;
