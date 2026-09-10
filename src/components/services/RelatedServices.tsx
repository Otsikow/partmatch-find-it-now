import React from "react";
import { Link } from "react-router-dom";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import { ArrowRight } from "lucide-react";

interface RelatedServicesProps {
  currentServiceId?: string;
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentServiceId,
}) => {
  const filteredServices = SERVICES_DATA.filter(
    (s) => s.id !== currentServiceId
  ).slice(0, 3);

  return (
    <section className="py-12 my-8">
      <div className="text-center mb-8 space-y-2">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Explore Related Platform Services
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover all the tools available to streamline your auto parts experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Link
            key={service.id}
            to={service.ctaLink}
            className="group rounded-2xl bg-card border border-border/40 hover:border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-xs font-semibold uppercase text-primary tracking-wider">
                  {service.badgeText || "Service"}
                </span>
                <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
              <span>{service.ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedServices;
