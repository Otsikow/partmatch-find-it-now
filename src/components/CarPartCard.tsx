
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

        <div onClick={handleCardClick} className="cursor-pointer">
          <CarPartCardContent
            part={part}
            onExpand={handleCardClick}
          />
        </div>
        <div className="px-3 pb-3">
          <CarPartCardFooter
            partId={part.id}
            supplierId={part.supplier_id}
            onContact={handleContactClick}
          />
        </div>
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
