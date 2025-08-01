import { CheckCircle, Truck, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TrustBenefitsSection = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Verified Sellers Only",
      description: "All sellers are manually approved for quality."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get parts shipped directly to your location."
    },
    {
      icon: MessageSquare,
      title: "Real-Time Chat",
      description: "Instantly chat with sellers to ask questions."
    }
  ];

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBenefitsSection;