import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const FooterSocialContact = () => {
  const {
    toast
  } = useToast();
  const handleSocialClick = (platform: string) => {
    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon.`
    });
  };
  return <div className="space-y-4">
      <h3 className="text-lg font-playfair font-semibold text-white">Social & Contact</h3>
      
      {/* Contact Info */}
      <div className="space-y-3 font-crimson">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span>support@partmatch.app</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span>Based in the UK, Ghana, Nigeria</span>
        </div>
      </div>

      {/* Social Media */}
      <div className="pt-2">
        <h4 className="text-sm font-medium text-white mb-3 font-playfair">Follow Us</h4>
        <div className="flex space-x-3">
          <Button variant="ghost" size="icon" asChild className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8">
            <a href="https://www.facebook.com/profile.php?id=61578112765008&locale=en_GB" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8">
            <a href="https://x.com/MatchPart1" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleSocialClick("Instagram")} className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8">
            <Instagram className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleSocialClick("LinkedIn")} className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-slate-700 font-crimson">
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-green-500" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Verified Sellers</span>
          </div>
        </div>
      </div>
    </div>;
};
export default FooterSocialContact;