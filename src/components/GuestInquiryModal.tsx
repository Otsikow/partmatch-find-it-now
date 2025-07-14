import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GuestInquiryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  partTitle: string;
  partId: string;
  sellerId: string;
}

const GuestInquiryModal = ({ 
  isOpen, 
  onOpenChange, 
  partTitle, 
  partId, 
  sellerId 
}: GuestInquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi! I'm interested in the ${partTitle}. Please contact me with more details.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the inquiry to the seller
      // For now, we'll show a success message and suggest WhatsApp
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Inquiry Sent!",
        description: "Your inquiry has been submitted. You'll receive a response via email soon.",
      });
      
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `Hi! I'm interested in the ${partTitle}. Please contact me with more details.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try WhatsApp instead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in the part "${partTitle}". Can you provide more details?\n\nMy contact info:\nName: ${formData.name || '[Your Name]'}\nEmail: ${formData.email || '[Your Email]'}\nPhone: ${formData.phone || '[Your Phone]'}`;
    
    // This would need seller's phone number - for now using placeholder
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Complete your inquiry via WhatsApp for faster response.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Quick Inquiry
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Part:</strong> {partTitle}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Send a quick inquiry without creating an account
            </p>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell the seller what you need..."
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleWhatsAppInquiry}
                className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Want full features like chat, saved parts, and order tracking?
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onOpenChange(false);
                window.location.href = "/auth";
              }}
              className="text-primary hover:text-primary/80"
            >
              Create Free Account
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestInquiryModal;