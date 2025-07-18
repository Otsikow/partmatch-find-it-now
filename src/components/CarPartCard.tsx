
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

const CarPartCard = ({ part, onContact }: CarPartCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <>
      <Card className="w-full bg-card shadow-md hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
        <CarPartCardImage
          partId={part.id}
          title={part.title}
          condition={part.condition}
          images={part.images}
          onExpand={handleCardClick}
        />

        <CarPartCardContent
          part={part}
          onExpand={handleCardClick}
        />

        <CarPartCardFooter
          partId={part.id}
          supplierId={part.supplier_id}
          onContact={handleContactClick}
        />
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
