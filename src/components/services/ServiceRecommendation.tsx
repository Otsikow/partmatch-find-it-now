import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const ServiceRecommendation: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string>("part-sourcing");

  const goals = [
    { id: "part-sourcing", label: "Find exact part by make/model" },
    { id: "location-search", label: "Need local seller nearby today" },
    { id: "escrow-payments", label: "Want payment & fraud protection" },
    { id: "verified-sellers", label: "Sell parts as a registered business" },
  ];

  const currentService = SERVICES_DATA.find((s) => s.id === selectedGoal) || SERVICES_DATA[0];

  return (
    <section className="py-12 my-8 rounded-3xl bg-gradient-to-b from-primary/5 via-transparent to-transparent border border-primary/10 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Service Guide</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Find the Exact Service You Need
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Select what you are trying to accomplish today:
        </p>
      </div>

      {/* Goal selection pills */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 max-w-3xl mx-auto">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedGoal === goal.id
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-card hover:bg-muted text-foreground border border-border/50"
            }`}
          >
            {goal.label}
          </button>
        ))}
      </div>

      {/* Recommended Service Highlight Box */}
      {currentService && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-card border border-border/60 p-6 sm:p-8 shadow-lg flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 h-48 sm:h-56 rounded-xl overflow-hidden relative">
            <img
              src={currentService.imageUrl}
              alt={currentService.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Recommended Service
            </span>
            <h3 className="text-2xl font-semibold text-foreground tracking-tight">
              {currentService.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {currentService.description}
            </p>
            <Button
              asChild
              className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to={currentService.ctaLink} className="inline-flex items-center gap-2">
                <span>{currentService.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceRecommendation;
