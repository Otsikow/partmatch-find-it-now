
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, Info, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CookiePolicy = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true
  });
  const { toast } = useToast();

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const savePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-100 font-inter">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Cookie className="h-12 w-12 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-crimson leading-relaxed">
            Learn about how we use cookies and similar technologies to enhance your experience on PartMatch.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 27, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* What Are Cookies */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-orange-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Info className="h-8 w-8 text-orange-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">What Are Cookies?</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  Cookies are small text files that are placed on your device when you visit a website. They help websites remember information about your visit, such as your preferred language, login status, and other settings that can make your next visit easier and the site more useful to you.
                </p>
                <p>
                  We use cookies and similar technologies (such as web beacons and pixels) to provide, protect, and improve our services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-blue-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Types of Cookies We Use</h2>
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Essential Cookies (Required)</h3>
                  <p className="text-gray-600 font-crimson mb-2">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Authentication and login status</li>
                    <li>Shopping cart contents</li>
                    <li>Security and fraud prevention</li>
                    <li>Website accessibility features</li>
                  </ul>
                </div>

                {/* Functional Cookies */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Functional Cookies</h3>
                  <p className="text-gray-600 font-crimson mb-2">
                    These cookies enhance functionality and personalization, such as remembering your preferences and settings.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Language preferences</li>
                    <li>Theme and display settings</li>
                    <li>Location preferences</li>
                    <li>Recently viewed items</li>
                  </ul>
                </div>

                {/* Analytics Cookies */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 font-crimson mb-2">
                    These cookies help us understand how visitors use our website, so we can improve our services.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Page views and user interactions</li>
                    <li>Time spent on pages</li>
                    <li>Error tracking and debugging</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>

                {/* Marketing Cookies */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600 font-crimson mb-2">
                    These cookies are used to show you relevant advertisements and measure the effectiveness of our marketing campaigns.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Personalized advertisements</li>
                    <li>Social media integration</li>
                    <li>Campaign effectiveness tracking</li>
                    <li>Retargeting and remarketing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Preferences */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-green-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Cookie Preferences</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600 font-crimson">
                  You can control which cookies we use by adjusting your preferences below. Note that disabling certain cookies may affect the functionality of our website.
                </p>
                
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                    <div>
                      <h4 className="font-semibold text-gray-800">Essential Cookies</h4>
                      <p className="text-sm text-gray-600">Required for basic website functionality</p>
                    </div>
                    <div className="text-sm text-gray-500">Always Active</div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">Functional Cookies</h4>
                      <p className="text-sm text-gray-600">Enhance website functionality and personalization</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => handlePreferenceChange('functional')}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">Help us improve our website through usage analytics</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">Used for personalized advertisements and marketing</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={savePreferences}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-purple-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Third-Party Cookies</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  Some cookies on our website are set by third-party services. These may include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Google Analytics:</strong> Website usage statistics and performance monitoring</li>
                  <li><strong>Social Media Platforms:</strong> Social sharing and login functionality</li>
                  <li><strong>Payment Processors:</strong> Secure payment processing and fraud prevention</li>
                  <li><strong>Customer Support:</strong> Live chat and support ticket systems</li>
                </ul>
                <p>
                  These third parties have their own privacy policies and cookie practices, which we encourage you to review.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-indigo-50/50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Managing Cookies</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>View and delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Delete all cookies when you close your browser</li>
                  <li>Get notifications when cookies are set</li>
                </ul>
                <p className="mt-4">
                  Please note that disabling cookies may affect the functionality of PartMatch and other websites you visit.
                </p>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Browser Help:</strong> For specific instructions on managing cookies, visit your browser's help section or search for "cookies" in your browser settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-gray-50/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Questions About Cookies?</h2>
              <div className="space-y-4 text-gray-600 font-crimson">
                <p>If you have questions about our use of cookies, please contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@partmatchgh.com</li>
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

export default CookiePolicy;
