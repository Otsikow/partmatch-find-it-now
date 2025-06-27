
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, Shield, Award, MapPin, Mail, Phone } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 font-inter">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Package className="h-12 w-12 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              About PartMatch
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-crimson leading-relaxed">
            Your trusted partner for automotive parts in Ghana. We connect customers with verified local sellers for quality parts and exceptional service.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-orange-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-orange-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-gray-600 font-crimson leading-relaxed">
                To revolutionize the automotive parts market in Ghana by creating a trusted platform that connects car owners with verified sellers, ensuring quality parts and transparent transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-green-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-gray-600 font-crimson leading-relaxed">
                To become Ghana's leading automotive parts marketplace, making it easy for everyone to find, buy, and sell quality car parts with confidence and convenience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-slate-50/50 mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6 text-center">Our Story</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-600 font-crimson leading-relaxed">
              <p>
                PartMatch was born from a simple observation: finding quality automotive parts in Ghana was unnecessarily complicated and time-consuming. Car owners often struggled to locate the right parts, while parts sellers had difficulty reaching potential customers.
              </p>
              <p>
                Founded in 2024, PartMatch bridges this gap by creating a comprehensive platform where verified sellers can showcase their inventory and customers can easily find exactly what they need. Our team combines deep understanding of the local automotive market with modern technology to deliver a seamless experience.
              </p>
              <p>
                Today, we're proud to serve customers across Ghana, connecting them with trusted sellers and quality parts. Our commitment to transparency, security, and customer satisfaction drives everything we do.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8 text-center">Why Choose PartMatch?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-blue-50/50">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">Verified Sellers</h3>
                <p className="text-gray-600 font-crimson">All our sellers are thoroughly vetted to ensure quality and reliability.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-purple-50/50">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">Quality Assurance</h3>
                <p className="text-gray-600 font-crimson">We maintain strict quality standards for all parts listed on our platform.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-green-50/50">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">Customer Support</h3>
                <p className="text-gray-600 font-crimson">Our dedicated team is here to help you every step of the way.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-slate-50/50">
          <CardContent className="p-8">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8 text-center">Get In Touch</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <MapPin className="h-8 w-8 text-orange-500 mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-gray-800">Visit Us</h3>
                <p className="text-gray-600 font-crimson">123 Auto Parts Street<br/>Motor City, MC 12345<br/>Ghana</p>
              </div>
              
              <div className="space-y-3">
                <Phone className="h-8 w-8 text-green-500 mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-gray-800">Call Us</h3>
                <p className="text-gray-600 font-crimson">+233 55 123-PART<br/>Monday - Saturday<br/>8:00 AM - 6:00 PM</p>
              </div>
              
              <div className="space-y-3">
                <Mail className="h-8 w-8 text-blue-500 mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-gray-800">Email Us</h3>
                <p className="text-gray-600 font-crimson">support@partmatch.com<br/>info@partmatch.com<br/>We reply within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default About;
