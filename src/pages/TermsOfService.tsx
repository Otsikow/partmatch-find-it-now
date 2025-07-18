
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 font-inter">
      <PageHeader 
        title="Terms of Service" 
        subtitle="Please read these terms carefully before using PartMatch. By using our platform, you agree to these terms and conditions."
        showBackButton={true}
        backTo="/"
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Scale className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
          </div>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 27, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-green-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  By accessing or using PartMatch ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
                </p>
                <p>
                  These terms apply to all users of the Platform, including buyers, sellers, and visitors.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-blue-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-8 w-8 text-blue-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">User Accounts</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-crimson">
                <h3 className="text-lg font-semibold text-gray-800">Account Registration</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-6">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Keep your account information up to date</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Use the Platform in compliance with all applicable laws</li>
                  <li>Respect other users and maintain professional conduct</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Seller Terms */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-orange-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Seller Terms</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <h3 className="text-lg font-semibold text-gray-800">Seller Verification</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>All sellers must complete our verification process</li>
                  <li>Provide valid business documentation where applicable</li>
                  <li>Maintain accurate contact and location information</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-6">Product Listings</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate descriptions and images of parts</li>
                  <li>Ensure parts are genuine and in described condition</li>
                  <li>Honor all sales and maintain fair pricing</li>
                  <li>Respond promptly to buyer inquiries</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Terms */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-purple-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Buyer Terms</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <h3 className="text-lg font-semibold text-gray-800">Purchase Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Verify part compatibility before purchase</li>
                  <li>Make payments promptly upon order confirmation</li>
                  <li>Inspect parts upon receipt and report issues within 48 hours</li>
                  <li>Communicate professionally with sellers</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-6">Returns and Refunds</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Return policies are set by individual sellers</li>
                  <li>Parts must be returned in original condition</li>
                  <li>Refund processing may take 5-10 business days</li>
                  <li>Shipping costs for returns may apply</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-red-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Prohibited Activities</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>The following activities are strictly prohibited on our Platform:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Selling counterfeit, stolen, or illegal parts</li>
                  <li>Fraudulent activities or misrepresentation</li>
                  <li>Harassment or abusive behavior toward other users</li>
                  <li>Attempting to bypass platform fees or processes</li>
                  <li>Using the Platform for any illegal purposes</li>
                  <li>Posting spam or irrelevant content</li>
                  <li>Attempting to hack or compromise platform security</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Platform Fees */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-indigo-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Platform Fees</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <ul className="list-disc list-inside space-y-2">
                  <li>Buyers can browse and search for free</li>
                  <li>Sellers pay a commission on successful sales</li>
                  <li>Payment processing fees may apply</li>
                  <li>Premium features may require subscription fees</li>
                </ul>
                <p className="mt-4">
                  Current fee structures are available on our pricing page and may be updated with reasonable notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-yellow-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  PartMatch serves as a marketplace platform connecting buyers and sellers. We do not manufacture, sell, or warranty any parts listed on the Platform.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>We are not responsible for the quality or condition of parts</li>
                  <li>Disputes between buyers and sellers should be resolved directly</li>
                  <li>Our liability is limited to the fees paid for our services</li>
                  <li>We provide the Platform "as is" without warranties</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-teal-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Termination</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  We reserve the right to suspend or terminate accounts for violations of these terms or for any reason with reasonable notice.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Users may close their accounts at any time</li>
                  <li>Outstanding transactions must be completed before termination</li>
                  <li>Certain provisions of these terms survive termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-gray-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>If you have questions about these Terms of Service, please contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> legal@partmatchgh.com</li>
                  <li><strong>Phone:</strong> +233 55 123-PART</li>
                  <li><strong>Address:</strong> 123 Auto Parts Street, Motor City, MC 12345, Ghana</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
