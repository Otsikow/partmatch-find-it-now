import { Search, MessageSquare, DollarSign, Truck, Plus, Users, Shield, HandHeart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorksSection = () => {
  const buyerSteps = [
    { icon: Search, title: "Browse or request a part", description: "Search our marketplace or post what you need" },
    { icon: MessageSquare, title: "Chat with seller", description: "Ask questions and negotiate directly" },
    { icon: DollarSign, title: "Make an offer", description: "Agree on price and payment terms" },
    { icon: Truck, title: "Get it delivered", description: "Receive your part at your location" }
  ];

  const sellerSteps = [
    { icon: Plus, title: "Create a free listing", description: "Post your parts with photos and details" },
    { icon: Users, title: "Receive buyer messages", description: "Connect with interested customers" },
    { icon: Shield, title: "Get verified for more exposure", description: "Boost credibility and reach more buyers" },
    { icon: HandHeart, title: "Close the deal", description: "Complete the sale and build your reputation" }
  ];

  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to buy or sell car parts on PartMatch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Buyers */}
          <Card className="bg-card border-0 shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-primary">
                For Buyers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {buyerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      Step {index + 1}: {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* For Sellers */}
          <Card className="bg-card border-0 shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-primary">
                For Sellers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sellerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      Step {index + 1}: {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;