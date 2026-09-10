import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceDetailModal from "@/components/services/ServiceDetailModal";
import ServiceComparison from "@/components/services/ServiceComparison";
import ServiceRecommendation from "@/components/services/ServiceRecommendation";
import RelatedServices from "@/components/services/RelatedServices";
import { Wrench, Package, ShieldCheck, Search } from "lucide-react";

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
      {/* Mobile & Desktop Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <Navigation />
      </div>

      <PageHeader
        title="Our Platform Services"
        subtitle="End-to-end automotive parts sourcing, verification, escrow & delivery"
        showBackButton={true}
        backTo="/"
      />

      {/* Hero Header Section with High-Impact Visual Presence */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24 my-6 rounded-3xl container mx-auto px-4 sm:px-6 shadow-2xl">
        <img
          src="/hero-car-parts.png"
          alt="PartMatch Auto Services"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/90" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md text-primary-foreground text-xs font-semibold tracking-wider uppercase">
            <Wrench className="h-4 w-4 text-primary" />
            <span>Apple-Level Refinement & Safety</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
            Designed for Speed, Authenticity & Peace of Mind
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Everything you need to buy, sell, verify, and deliver vehicle components safely across Ghana and beyond.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-3 bg-white text-slate-950 hover:bg-slate-100 font-medium transition-all shadow-lg"
            >
              <Link to="/search-parts" className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search Parts Catalog</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-3 border-white/30 text-white hover:bg-white/10 font-medium backdrop-blur-md"
            >
              <Link to="/request-part">
                <span>Request Custom Quote</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 space-y-16">
        {/* Main Services List with Prominent Imagery */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Core Platform Services
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Explore our suite of specialized solutions built specifically for vehicle owners, mechanics, and parts suppliers.
            </p>
          </div>

          <div className="space-y-8">
            {SERVICES_DATA.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                reversed={index % 2 === 1}
                onSelectService={handleSelectService}
              />
            ))}
          </div>
        </section>

        {/* Interactive Service Finder */}
        <ServiceRecommendation />

        {/* Side-by-side Service Comparison */}
        <ServiceComparison />

        {/* Related Services */}
        <RelatedServices />

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 text-white mb-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Ready to Upgrade Your Auto Sourcing Experience?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Join thousands of satisfied vehicle owners and verified sellers on Ghana's premier auto parts network.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Link to="/search-parts">Find Parts Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-slate-700 text-white hover:bg-slate-800 font-medium"
              >
                <Link to="/supplier">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Services;
