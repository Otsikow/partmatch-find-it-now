import React from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ServiceItem } from "@/data/servicesData";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl">
        {/* Modal Image Header */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-muted">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {service.badgeText && (
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant="secondary"
                className="bg-background/90 text-foreground font-medium text-xs px-3 py-1.5 rounded-full shadow-sm"
              >
                {service.badgeText}
              </Badge>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-6 -mt-10 relative z-10 bg-card/90 rounded-t-3xl backdrop-blur-md">
          <DialogHeader className="text-left space-y-2">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary">
              {service.subtitle}
            </p>
            <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              {service.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-2">
              {service.fullDescription}
            </DialogDescription>
          </DialogHeader>

          {/* Key Features */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Included Benefits & Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-2xl bg-muted/50 border border-border/30 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full px-6 border-border/60 hover:bg-muted"
            >
              Close
            </Button>
            <Button
              asChild
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Link to={service.ctaLink} onClick={onClose} className="inline-flex items-center gap-2">
                <span>{service.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
