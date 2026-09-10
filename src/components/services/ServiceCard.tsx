import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceItem } from "@/data/servicesData";

interface ServiceCardProps {
  service: ServiceItem;
  onSelectService?: (service: ServiceItem) => void;
  reversed?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService,
  reversed = false,
}) => {
  return (
    <div
      className={`group relative rounded-3xl bg-card/80 dark:bg-card/40 backdrop-blur-md border border-border/40 hover:border-border/80 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl flex flex-col ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-0 items-stretch my-8 lg:my-12`}
    >
      {/* Visual Image Container - Large, Prominent, Reference Standard Proportions */}
      <div className="relative w-full lg:w-3/5 h-64 sm:h-80 md:h-96 lg:h-auto min-h-[280px] lg:min-h-[420px] overflow-hidden bg-muted">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle Gradient Overlay for visual refinement */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />

        {/* Badge Overlay */}
        {service.badgeText && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <Badge
              variant="secondary"
              className="bg-background/90 dark:bg-background/80 backdrop-blur-md text-foreground font-medium text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-sm border border-border/20"
            >
              {service.badgeText}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Container - Generous Spacing, Clean Typography */}
      <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-wider uppercase text-primary/90">
            {service.subtitle}
          </p>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-tight">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            {service.description}
          </p>

          {/* Features List */}
          <ul className="space-y-2.5 pt-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm sm:text-base text-foreground/90">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-6 py-3 font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md group/btn"
          >
            <Link to={service.ctaLink} className="inline-flex items-center justify-center gap-2">
              <span>{service.ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>

          {onSelectService && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => onSelectService(service)}
              className="rounded-full px-6 py-3 font-medium border-border/60 hover:bg-muted text-foreground transition-all duration-300"
            >
              Learn Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
