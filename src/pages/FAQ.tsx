import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Globe, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqSections = [
    {
      title: "General Questions",
      emoji: "🔍",
      questions: [
        {
          question: "What is PartMatch?",
          answer: "PartMatch is an AI-powered online marketplace where car owners, mechanics, and auto parts dealers can buy, sell, or request car parts across multiple countries. It supports location-based filtering, trusted seller ratings, and real-time messaging."
        },
        {
          question: "How does PartMatch work?",
          answer: "Buyers can search or request specific car parts. Sellers can list parts for sale and respond to buyer requests. The system matches buyers and sellers based on car make, model, year, location, and condition."
        },
        {
          question: "Which countries does PartMatch support?",
          answer: "PartMatch is a global app, currently optimized for Ghana, Nigeria, Kenya, and other African and international markets. Language, currency, and listings adjust based on your location."
        }
      ]
    },
    {
      title: "Account & Profile",
      emoji: "🧾",
      questions: [
        {
          question: "Do I need an account to use PartMatch?",
          answer: "You can browse parts without registering, but to post, request, chat, or buy, you'll need to create an account."
        },
        {
          question: "How do I register?",
          answer: "Register by entering your name, email, and phone number. You'll receive a confirmation link to activate your account."
        },
        {
          question: "Can I register without email confirmation?",
          answer: "No. Email confirmation is required to activate your account and access all features."
        },
        {
          question: "How do I edit or delete my account?",
          answer: "Go to Settings > Account, where you can update your details or request account deletion."
        }
      ]
    },
    {
      title: "Buying & Requesting Parts",
      emoji: "🛒",
      questions: [
        {
          question: "How do I search for car parts?",
          answer: "Use the search bar, enter the car brand, model, year, or part name, and apply location or condition filters."
        },
        {
          question: "What if I can't find the part I need?",
          answer: "Click 'Request a Part' from the home screen. Describe your part, car details, and location. Sellers will respond with offers."
        },
        {
          question: "Do I need to be signed in to request a part?",
          answer: "Yes. You must be signed in with a confirmed email to post a request."
        },
        {
          question: "How will sellers contact me?",
          answer: "You will receive notifications in your dashboard and can chat directly using the built-in Chat with Seller feature."
        }
      ]
    },
    {
      title: "Selling & Promotions",
      emoji: "💼",
      questions: [
        {
          question: "How do I list a car part for sale?",
          answer: "Tap 'Sell a Part', upload clear photos, add part details, car compatibility, location, and your asking price."
        },
        {
          question: "Can I promote my listings?",
          answer: "Yes! You can Feature a Listing (shown at the top), Boost a Listing (highlighted with priority), or Add Extra Photos for visibility. These are available during or after posting."
        },
        {
          question: "How long do promotions last?",
          answer: "You can choose between 7 days or 30 days. Prices vary based on country and package."
        }
      ]
    },
    {
      title: "Payments & Subscriptions",
      emoji: "💰",
      questions: [
        {
          question: "Is PartMatch free to use?",
          answer: "Browsing and basic listing is free. Promotions and business subscriptions come with a fee."
        },
        {
          question: "How do I pay for featured or boosted listings?",
          answer: "You can pay securely using Paystack, Stripe, or other local payment gateways depending on your country."
        },
        {
          question: "Do you support local currencies?",
          answer: "Yes. PartMatch detects your location and automatically shows prices in your local currency."
        }
      ]
    },
    {
      title: "Orders & Transactions",
      emoji: "📦",
      questions: [
        {
          question: "Can I buy directly through the app?",
          answer: "Currently, PartMatch connects you with the seller. You agree on the payment method and delivery. An in-app escrow system is coming soon."
        },
        {
          question: "What if I get scammed?",
          answer: "Only deal with verified sellers and use chat history for evidence. PartMatch is building a review and report system to protect buyers."
        }
      ]
    },
    {
      title: "Language, Location & Filters",
      emoji: "🌍",
      questions: [
        {
          question: "How is the app adapted for my country?",
          answer: "Language, currency, and car brands adjust to your location. You can manually select your country if needed. Listings can be filtered by region, city, and seller rating."
        }
      ]
    },
    {
      title: "Reviews, Ratings & Trust",
      emoji: "⭐",
      questions: [
        {
          question: "Can I rate sellers and parts?",
          answer: "Yes. After a successful transaction, you can leave a review and rating for the seller."
        },
        {
          question: "What do seller badges mean?",
          answer: "Seller badges show their trust level, responsiveness, and review scores, helping buyers choose reliable vendors."
        }
      ]
    },
    {
      title: "Mobile App Features",
      emoji: "📱",
      questions: [
        {
          question: "Is there a mobile app?",
          answer: "Yes. PartMatch is available on Android and iOS. You can download it from your app store or visit www.partmatch.app."
        },
        {
          question: "Why can't I see reviews even though the seller has some?",
          answer: "This could be a bug. Make sure the app is updated. If it persists, contact support below."
        }
      ]
    },
    {
      title: "Support & Troubleshooting",
      emoji: "🧑‍💻",
      questions: [
        {
          question: "How do I contact support?",
          answer: "Use the Help & Support section in your app, or email support@partmatch.app."
        },
        {
          question: "What if the app crashes or freezes?",
          answer: "Ensure your app is up to date. If the issue continues, clear your cache or reinstall the app."
        },
        {
          question: "I found a bug. How do I report it?",
          answer: "Go to Settings > Report a Bug or email a screenshot and description to bugs@partmatch.app."
        }
      ]
    },
    {
      title: "Security & Privacy",
      emoji: "🔐",
      questions: [
        {
          question: "Is my data safe on PartMatch?",
          answer: "Yes. We use industry-standard encryption, and your data is stored securely with GDPR-compliant practices."
        },
        {
          question: "Will my contact information be public?",
          answer: "Only verified and necessary seller/buyer contact info is shared privately during transactions. You control your visibility."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary font-inter">
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about PartMatch"
        showBackButton={true}
        backTo="/"
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <HelpCircle className="h-10 w-10 text-primary" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-crimson leading-relaxed">
            Get quick answers to the most common questions about using PartMatch to buy, sell, and request automotive parts.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="shadow-lg border-0 bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-2xl font-playfair">
                  <span className="text-2xl">{section.emoji}</span>
                  <span className="text-gray-800">{section.title}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {section.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${sectionIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium text-gray-700">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-gray-600 font-crimson leading-relaxed pt-2">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Have Questions Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white/90 to-blue-50/50 mt-12">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Mail className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl font-playfair font-bold text-gray-800">
                Still Have Questions?
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-crimson mb-6">
              Visit our Help Center or contact us directly
            </p>
            <Separator className="my-6" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Mail className="h-6 w-6 text-blue-500 mx-auto" />
                <p className="font-medium text-gray-800">Email Support</p>
                <p className="text-blue-600 font-crimson">support@partmatch.app</p>
              </div>
              <div className="space-y-2">
                <Globe className="h-6 w-6 text-green-500 mx-auto" />
                <p className="font-medium text-gray-800">Visit Our Website</p>
                <p className="text-green-600 font-crimson">www.partmatch.app</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;