export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  badgeText?: string;
  category: 'core' | 'logistics' | 'trust';
  features: string[];
  ctaText: string;
  ctaLink: string;
}

export interface ServiceComparisonItem {
  feature: string;
  partMatch: string;
  traditional: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "part-sourcing",
    title: "AI-Powered Part Sourcing",
    subtitle: "Instant precision matching by make, model, year & OEM specification",
    description: "Find exact OEM and aftermarket replacement parts using our intelligent algorithmic catalog search across thousands of active supplier inventories.",
    fullDescription: "PartMatch's AI-Powered Part Sourcing matches your exact vehicle year, trim, and VIN specifications with verified local and international inventories. Eliminate guess-work and avoid buying incompatible parts with our automated compatibility cross-reference system.",
    imageUrl: "/hero-car-parts.png",
    badgeText: "Core Platform",
    category: "core",
    features: [
      "VIN & Make/Model direct compatibility check",
      "Real-time local inventory query",
      "Cross-referencing OEM part numbers",
      "Direct chat with sellers before purchasing"
    ],
    ctaText: "Search Parts Now",
    ctaLink: "/search-parts"
  },
  {
    id: "verified-sellers",
    title: "Verified Seller Network",
    subtitle: "Vetted suppliers, physical shop inspections & business registration",
    description: "Every supplier on PartMatch undergoes identity verification, business licensing checks, and quality history audits to guarantee authenticity.",
    fullDescription: "Drive with confidence knowing every seller on PartMatch is vetted. We verify local business registration, physical shop locations, and track transaction success rates. Fake components and fraudulent sellers are systematically barred from our platform.",
    imageUrl: "/sell-parts-hero.png",
    badgeText: "Trusted Quality",
    category: "trust",
    features: [
      "Physical store location verification",
      "Government business license audit",
      "Transparent seller ratings & reviews",
      "Anti-counterfeit parts policy"
    ],
    ctaText: "Become a Verified Seller",
    ctaLink: "/supplier"
  },
  {
    id: "escrow-payments",
    title: "Escrow & Secure Payments",
    subtitle: "Funds held securely until your part is received and inspected",
    description: "Protect your money with built-in buyer protection and escrow services. Payments are only released to suppliers once you confirm receipt.",
    fullDescription: "Never lose money to unverified upfront transfers. PartMatch's Secure Escrow Payment Gateway holds payment safely. Once your ordered part arrives and matches the description, funds are released to the vendor seamlessly.",
    imageUrl: "/car-parts-bg1.png",
    badgeText: "Financial Safety",
    category: "trust",
    features: [
      "100% Buyer Protection guarantee",
      "Mobile Money & Card integration",
      "Escrow fund lock until order confirmation",
      "Dispute resolution team on standby"
    ],
    ctaText: "Explore Payment Protection",
    ctaLink: "/terms-of-service"
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance & Warranty",
    subtitle: "Rigorous standards, transparent condition tiers & return guarantees",
    description: "Detailed condition grading for new, grade-A used, and refurbished parts, backed by transparent return policies and warranty options.",
    fullDescription: "Whether purchasing brand new genuine OEM parts or tested secondhand assemblies, PartMatch requires sellers to disclose detailed condition photos, mileage/usage records, and offer standardized warranty windows for peace of mind.",
    imageUrl: "/brake-hero-image.png",
    badgeText: "Verified Quality",
    category: "trust",
    features: [
      "Standardized condition grading (New, Like New, Used, Refurbished)",
      "Mandatory high-res photo disclosure",
      "7 to 30-day warranty coverage options",
      "Hassle-free return workflow"
    ],
    ctaText: "View Quality Standards",
    ctaLink: "/faq"
  },
  {
    id: "location-search",
    title: "Location-Based Map Sourcing",
    subtitle: "Find local sellers in your area for immediate pickup or same-day delivery",
    description: "Map-based spatial search showing closest sellers with available stock, saving time and reducing long-distance shipping costs.",
    fullDescription: "In an emergency breakdown, proximity matters. Our interactive map search highlights local auto parts shops near your current GPS location, enabling instant pickup or express localized courier dispatch within minutes.",
    imageUrl: "/request-parts-hero.png",
    badgeText: "Proximity Search",
    category: "logistics",
    features: [
      "Interactive map with real-time vendor pins",
      "Distance-calculated shipping costs",
      "Direct store pickup scheduling",
      "Turn-by-turn navigation to seller"
    ],
    ctaText: "Search with Map",
    ctaLink: "/search-map"
  },
  {
    id: "delivery-logistics",
    title: "Nationwide Logistics & Delivery",
    subtitle: "Tracked express shipping to your home, workshop, or mechanic",
    description: "Partnered with top-tier courier networks across Ghana and West Africa to ensure fast, safe, and traceable door-to-door part deliveries.",
    fullDescription: "From engine blocks to minor electrical sensors, our integrated delivery service handles parts of all sizes. Receive live GPS tracking updates directly on your mobile device from dispatch to doorstep.",
    imageUrl: "/car-parts-bg3.png",
    badgeText: "Express Logistics",
    category: "logistics",
    features: [
      "Nationwide door-to-door delivery",
      "Real-time SMS & app order tracking",
      "Insured transit against damage or loss",
      "Direct delivery to your mechanic's workshop"
    ],
    ctaText: "Check Delivery Options",
    ctaLink: "/contact"
  }
];

export const SERVICE_COMPARISONS: ServiceComparisonItem[] = [
  {
    feature: "Part Authenticity & Quality",
    partMatch: "Vetted sellers, clear condition grades & warranty guarantees",
    traditional: "High risk of counterfeit or wrong parts without warranty"
  },
  {
    feature: "Search Speed & Convenience",
    partMatch: "Instant online search across hundreds of stores in seconds",
    traditional: "Hours driving between physical junkyards and auto shops"
  },
  {
    feature: "Payment Protection",
    partMatch: "Escrow system — money released only after inspection",
    traditional: "Non-refundable cash or upfront wire transfer risk"
  },
  {
    feature: "Delivery & Tracking",
    partMatch: "Direct to door/workshop with live real-time GPS tracking",
    traditional: "Self-pickup only or unorganized informal delivery"
  }
];
