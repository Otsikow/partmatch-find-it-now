import { Card } from "@/components/ui/card";
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

export const CarPartCard = ({ part, onContact }: CarPartCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { trackListingView, trackListingClick } = useListingAnalytics();

  useEffect(() => {
    trackListingView(part.id);
  }, [part.id, trackListingView]);

  const handleCardClick = () => {
    trackListingClick(part.id, "card_click");
    setIsExpanded(true);
  };

  const handleContactClick = () => {
    trackListingClick(part.id, "contact_click");
    if (onContact) onContact();
  };

  return (
    <>
      <Card className="w-full bg-card/90 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 border border-border/40 hover:border-border/80 rounded-2xl overflow-hidden flex flex-col justify-between">
        <CarPartCardImage
          partId={part.id}
          title={part.title}
          condition={part.condition}
          images={part.images}
          isFeatured={part.is_featured}
          onExpand={handleCardClick}
        />

        <div onClick={handleCardClick} className="cursor-pointer flex-1">
          <CarPartCardContent part={part} onExpand={handleCardClick} />
        </div>

        <div className="p-4 pt-0">
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
