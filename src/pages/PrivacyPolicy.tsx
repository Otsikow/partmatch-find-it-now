
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, FileText, UserCheck, Cookie, Phone, Clock } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 font-inter">
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
        showBackButton={true}
        backTo="/"
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">Last updated: December 27, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Name, email address, and phone number when you register</li>
                  <li>Billing and shipping addresses for transactions</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Profile information and preferences</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground mt-6">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Pages you visit and features you use</li>
                  <li>Search queries and preferences</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data (if permitted)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Process transactions and send confirmations</li>
                  <li>Communicate with you about orders and updates</li>
                  <li>Send relevant notifications and recommendations</li>
                  <li>Verify seller credentials and maintain platform security</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Information Sharing</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>With Sellers:</strong> Contact information necessary to complete transactions</li>
                  <li><strong>Service Providers:</strong> Payment processors, delivery services, and technical support</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Data Security</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>We implement industry-standard security measures to protect your personal information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure servers with regular security updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Secure payment processing through certified providers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <UserCheck className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Your Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Cookie className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Cookies and Tracking</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure platform security</li>
                </ul>
                <p className="mt-4">You can control cookie settings through your browser preferences.</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Phone className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Contact Us</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@partmatchgh.com</li>
                  <li><strong>Phone:</strong> +233 55 123-PART</li>
                  <li><strong>Address:</strong> 123 Auto Parts Street, Motor City, MC 12345, Ghana</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="shadow-lg border-0 bg-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-playfair font-bold text-foreground">Policy Updates</h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-crimson">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
