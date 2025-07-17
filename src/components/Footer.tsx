
import { Separator } from "@/components/ui/separator";
import FooterCompanyInfo from "./FooterCompanyInfo";
import FooterQuickLinks from "./FooterQuickLinks";
import FooterUsefulInfo from "./FooterUsefulInfo";
import FooterSocialContact from "./FooterSocialContact";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <FooterCompanyInfo />
          <FooterQuickLinks />
          <FooterUsefulInfo />
          <FooterSocialContact />
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
