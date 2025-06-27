
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Package,
  Shield,
  Users,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  const handleSocialClick = (platform: string) => {
    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon.`,
    });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-playfair font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                PartMatch
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-crimson">
              Your trusted partner for automotive parts. Connecting customers with verified local sellers for quality parts and exceptional service.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>123 Auto Parts Street, Motor City, MC 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>+1 (555) 123-PART</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>support@partmatch.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
                >
                  <Package className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/search" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
                >
                  <Wrench className="h-3 w-3" />
                  <span>Browse Parts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/request" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
                >
                  <Users className="h-3 w-3" />
                  <span>Request Parts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/supplier" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
                >
                  <Shield className="h-3 w-3" />
                  <span>Seller Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold text-white">Our Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 text-sm font-crimson">Part Sourcing & Matching</li>
              <li className="text-gray-300 text-sm font-crimson">Verified Seller Network</li>
              <li className="text-gray-300 text-sm font-crimson">Secure Payment Processing</li>
              <li className="text-gray-300 text-sm font-crimson">Quality Assurance</li>
              <li className="text-gray-300 text-sm font-crimson">Customer Support</li>
              <li className="text-gray-300 text-sm font-crimson">Mobile Notifications</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm font-crimson">
              Subscribe to our newsletter for the latest updates on new sellers and special offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-inter"
              >
                Subscribe
              </Button>
            </form>
            
            {/* Social Media */}
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-3 font-crimson">Follow Us</h4>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocialClick("Facebook")}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocialClick("Twitter")}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocialClick("Instagram")}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocialClick("LinkedIn")}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400 font-crimson text-center md:text-left">
            © {new Date().getFullYear()} PartMatch. All rights reserved. Built with automotive excellence in mind.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <button 
              onClick={() => toast({ title: "Privacy Policy", description: "Privacy policy page coming soon." })}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => toast({ title: "Terms of Service", description: "Terms of service page coming soon." })}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => toast({ title: "Cookie Policy", description: "Cookie policy page coming soon." })}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
