
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FooterNewsletter = () => {
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
            asChild
            className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
          >
            <a href="https://www.facebook.com/profile.php?id=61578112765008&locale=en_GB" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-gray-300 hover:text-white hover:bg-slate-700 h-8 w-8"
          >
            <a href="https://x.com/MatchPart1" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
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
  );
};

export default FooterNewsletter;
