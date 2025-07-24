import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Users,
  Shield,
  Award,
  MapPin,
  Mail,
  Phone,
  Target,
  Eye,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary font-inter">
      <PageHeader
        title={t("about.title", "About Us")}
        subtitle={t(
          "about.subtitle",
          "Your trusted partner for automotive parts in Ghana"
        )}
        showBackButton={true}
        backTo="/"
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Package className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-crimson leading-relaxed px-4">
            {t(
              "about.hero",
              "We connect customers with verified local sellers for quality parts and exceptional service."
            )}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-card dark:bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">
                  {t("about.missionTitle", "Our Mission")}
                </h2>
              </div>
              <p className="text-muted-foreground font-crimson leading-relaxed">
                {t(
                  "about.mission",
                  "To revolutionize the automotive parts market in Ghana by creating a trusted platform that connects car buyers with verified sellers, ensuring quality parts and transparent transactions."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card dark:bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">
                  {t("about.visionTitle", "Our Vision")}
                </h2>
              </div>
              <p className="text-muted-foreground font-crimson leading-relaxed">
                {t(
                  "about.vision",
                  "To become Ghana's leading automotive parts marketplace, making it easy for everyone to find, buy, and sell quality car parts with confidence and convenience."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="shadow-lg border-0 bg-card dark:bg-card mb-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Star className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-playfair font-bold text-foreground">
                {t("about.storyTitle", "Our Story")}
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground font-crimson leading-relaxed">
              <p>
                {t(
                  "about.story1",
                  "Our platform was born from a simple observation: finding quality automotive parts in Ghana was unnecessarily complicated and time-consuming. Car buyers often struggled to locate the right parts, while parts sellers had difficulty reaching potential customers."
                )}
              </p>
              <p>
                {t(
                  "about.story2",
                  "Founded in 2024, our platform bridges this gap by creating a comprehensive marketplace where verified sellers can showcase their inventory and customers can easily find exactly what they need. Our team combines deep understanding of the local automotive market with modern technology to deliver a seamless experience."
                )}
              </p>
              <p>
                {t(
                  "about.story3",
                  "Today, we're proud to serve customers across Ghana, connecting them with trusted sellers and quality parts. Our commitment to transparency, security, and customer satisfaction drives everything we do."
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <CheckCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-playfair font-bold text-foreground">
              {t("about.whyChooseUs", "Why Choose Us?")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-foreground mb-3">
                  {t("about.verifiedSellers", "Verified Sellers")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  {t(
                    "about.verifiedSellersDesc",
                    "All our sellers are thoroughly vetted to ensure quality and reliability."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-foreground mb-3">
                  {t("about.qualityAssurance", "Quality Assurance")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  {t(
                    "about.qualityAssuranceDesc",
                    "We maintain strict quality standards for all parts listed on our platform."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card dark:bg-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-playfair font-bold text-foreground mb-3">
                  {t("about.customerSupport", "Customer Support")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  {t(
                    "about.customerSupportDesc",
                    "Our dedicated team is here to help you every step of the way."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 bg-card dark:bg-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Mail className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-playfair font-bold text-foreground">
                {t("about.getInTouch", "Get In Touch")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <MapPin className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-foreground">
                  {t("about.visitUs", "Visit Us")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  AK-798-9707, Apayo, Atwima Kwawoma, Kumasi, Ghana
                  <br />
                  Seaview Business Centre, Redcar, UK TS10 1AZ
                </p>
              </div>
              <div className="space-y-3">
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-foreground">
                  {t("about.callUs", "Call Us")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  +233 55 123-PART
                  <br />
                  {t("about.hours", "Monday - Saturday")}
                  <br />
                  {t("about.openingHours", "8:00 AM - 6:00 PM")}
                </p>
              </div>
              <div className="space-y-3">
                <Mail className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-lg font-playfair font-bold text-foreground">
                  {t("about.emailUs", "Email Us")}
                </h3>
                <p className="text-muted-foreground font-crimson">
                  support@partmatch.app
                  <br />
                  {t("about.replyTime", "We reply within 24 hours")}
                </p>
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
