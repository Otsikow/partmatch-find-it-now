
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Package, 
  Search, 
  Shield, 
  CreditCard, 
  Users, 
  Bell, 
  Award, 
  Wrench,
  MapPin,
  Truck
} from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary font-inter">
      <PageHeader 
        title="Our Services" 
        subtitle="Comprehensive automotive parts solutions for Ghana"
        showBackButton={true}
        backTo="/"
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Wrench className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-crimson leading-relaxed px-4">
            Designed to make your car maintenance and repairs easier, faster, and more reliable.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Search className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Part Sourcing & Matching</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                Advanced search and matching system to help you find the exact parts you need for your vehicle. Our intelligent algorithms match parts based on make, model, year, and specifications.
              </p>
              <Link to="/search-parts">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Search Parts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Verified Seller Network</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                All sellers on our platform are thoroughly vetted and verified. We conduct background checks, verify business licenses, and ensure quality standards are met.
              </p>
              <Link to="/supplier">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Become a Seller
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <CreditCard className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Secure Payment Processing</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                Safe and secure payment gateway with multiple payment options. We protect both buyers and sellers with escrow services and fraud protection.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Quality Assurance</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                Comprehensive quality checks and return policies. We ensure all parts meet industry standards and provide warranties where applicable.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Quality Standards
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Customer Support</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                24/7 customer support team ready to assist with orders, technical questions, and dispute resolution. Multiple contact channels available.
              </p>
              <Link to="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Bell className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Mobile Notifications</h3>
              <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                Real-time notifications for order updates, new parts matching your searches, and important account activities. Stay informed wherever you are.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Enable Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-8 text-center">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <MapPin className="h-10 w-10 text-primary" />
                  <h3 className="text-2xl font-playfair font-bold text-foreground">Location-Based Search</h3>
                </div>
                <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                  Find parts near your location to reduce shipping costs and delivery time. Our map-based search shows nearby sellers and available parts.
                </p>
                <Link to="/search-map">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Search with Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Truck className="h-10 w-10 text-primary" />
                  <h3 className="text-2xl font-playfair font-bold text-foreground">Delivery Services</h3>
                </div>
                <p className="text-muted-foreground font-crimson leading-relaxed mb-6">
                  Partnered with reliable delivery services across Ghana. Track your orders in real-time and get parts delivered to your doorstep or preferred location.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Delivery Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-lg border-0 bg-card dark:bg-card">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground font-crimson leading-relaxed mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our platform for their automotive parts needs. Start searching for parts or become a verified seller today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search-parts">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8">
                  Find Parts Now
                </Button>
              </Link>
              <Link to="/request-part">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent font-medium px-8">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
