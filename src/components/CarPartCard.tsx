
import { Card } from "@/components/ui/card";
import { CarPart } from "@/types/CarPart";
import { useState } from "react";
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

  return (
    <>
      <Card className="w-full bg-white shadow-md hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
        <CarPartCardImage
          partId={part.id}
          title={part.title}
          condition={part.condition}
          images={part.images}
          onExpand={() => setIsExpanded(true)}
        />

        <CarPartCardContent
          part={part}
          onExpand={() => setIsExpanded(true)}
        />

        <CarPartCardFooter
          partId={part.id}
          supplierId={part.supplier_id}
          onContact={onContact}
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
