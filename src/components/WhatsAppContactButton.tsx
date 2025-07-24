import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WhatsAppContactButtonProps {
  partTitle: string;
  sellerName?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const WhatsAppContactButton = ({ 
  partTitle, 
  sellerName = "Seller",
  className = "",
  variant = "outline",
  size = "default"
}: WhatsAppContactButtonProps) => {
  
  const handleWhatsAppContact = () => {
    const message = `Hi ${sellerName}! I'm interested in your "${partTitle}" listing on PartMatch. Can you please provide more details about:\n\n• Condition and availability\n• Final price and negotiation\n• Location for pickup/delivery\n• Any warranty or return policy\n\nThanks!`;
    
    // In a real app, you'd get the seller's phone number from the database
    // For now, we'll open WhatsApp with the message pre-filled
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Add the seller's phone number to send your inquiry.",
    });
  };

  return (
    <Button 
      onClick={handleWhatsAppContact}
      variant={variant}
      size={size}
      className={`border-green-600 text-green-700 hover:bg-green-50 font-semibold transition-all duration-300 ${className}`}
    >
      <Phone className="h-4 w-4 mr-2" />
      WhatsApp Seller
    </Button>
  );
};

export default WhatsAppContactButton;