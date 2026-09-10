import React from "react";
import { Check, X } from "lucide-react";
import { SERVICE_COMPARISONS } from "@/data/servicesData";

export const ServiceComparison: React.FC = () => {
  return (
    <section className="py-16 my-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Why Choose PartMatch Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare how our modern digital automotive marketplace compares to traditional manual sourcing.
          </p>
        </div>

        <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-muted/60 p-4 sm:p-6 border-b border-border/40 font-semibold text-sm sm:text-base text-foreground">
            <div className="hidden md:block">Service Standard</div>
            <div className="text-primary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
              PartMatch Platform
            </div>
            <div className="text-muted-foreground flex items-center gap-2 mt-2 md:mt-0">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-muted-foreground/40"></span>
              Traditional Sourcing
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {SERVICE_COMPARISONS.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-3 p-4 sm:p-6 gap-4 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="font-medium text-foreground text-base">
                  {item.feature}
                </div>
                <div className="flex items-start gap-3 text-sm text-foreground/90 p-3 rounded-2xl bg-primary/5 border border-primary/20">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item.partMatch}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground p-3 rounded-2xl bg-muted/40">
                  <X className="h-5 w-5 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span>{item.traditional}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceComparison;
