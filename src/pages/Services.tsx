
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 font-inter">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Wrench className="h-12 w-12 text-purple-500" />
            <h1 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Services
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-crimson leading-relaxed">
            Comprehensive automotive parts solutions designed to make your car maintenance and repairs easier, faster, and more reliable.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-blue-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Search className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Part Sourcing & Matching</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                Advanced search and matching system to help you find the exact parts you need for your vehicle. Our intelligent algorithms match parts based on make, model, year, and specifications.
              </p>
              <Link to="/search-parts">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Search Parts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-green-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Verified Seller Network</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                All sellers on our platform are thoroughly vetted and verified. We conduct background checks, verify business licenses, and ensure quality standards are met.
              </p>
              <Link to="/supplier">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  Become a Seller
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-orange-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <CreditCard className="h-16 w-16 text-orange-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Secure Payment Processing</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                Safe and secure payment gateway with multiple payment options. We protect both buyers and sellers with escrow services and fraud protection.
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-purple-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Award className="h-16 w-16 text-purple-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Quality Assurance</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                Comprehensive quality checks and return policies. We ensure all parts meet industry standards and provide warranties where applicable.
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                Quality Standards
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-red-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Customer Support</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                24/7 customer support team ready to assist with orders, technical questions, and dispute resolution. Multiple contact channels available.
              </p>
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-indigo-50/50 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Bell className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Mobile Notifications</h3>
              <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                Real-time notifications for order updates, new parts matching your searches, and important account activities. Stay informed wherever you are.
              </p>
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                Enable Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8 text-center">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-teal-50/50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <MapPin className="h-10 w-10 text-teal-500" />
                  <h3 className="text-2xl font-playfair font-bold text-gray-800">Location-Based Search</h3>
                </div>
                <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                  Find parts near your location to reduce shipping costs and delivery time. Our map-based search shows nearby sellers and available parts.
                </p>
                <Link to="/search-map">
                  <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                    Search with Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-cyan-50/50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Truck className="h-10 w-10 text-cyan-500" />
                  <h3 className="text-2xl font-playfair font-bold text-gray-800">Delivery Services</h3>
                </div>
                <p className="text-gray-600 font-crimson leading-relaxed mb-6">
                  Partnered with reliable delivery services across Ghana. Track your orders in real-time and get parts delivered to your doorstep or preferred location.
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
                  Delivery Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-gray-50/50">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 font-crimson leading-relaxed mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust PartMatch for their automotive parts needs. Start searching for parts or become a verified seller today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search-parts">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8">
                  Find Parts Now
                </Button>
              </Link>
              <Link to="/request-part">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8">
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
