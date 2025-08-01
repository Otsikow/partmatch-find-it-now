import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const testimonials = [
  {
    id: 1,
    name: "Kwame Asante",
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    partPurchased: "Toyota Corolla Alternator",
    review: "Found the exact alternator I needed for my 2015 Corolla within 24 hours! The seller was professional, the part was genuine, and the price was fair. Saved me days of searching in Accra. Highly recommend PartMatch!",
    helpful: 24
  },
  {
    id: 2,
    name: "Amina Osei",
    location: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b422?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    verified: true,
    partPurchased: "Honda Civic Brake Pads",
    review: "The chat feature made everything so easy! I could negotiate directly with the seller and ask all my questions before buying. Got my brake pads delivered the same day. Amazing service!",
    helpful: 18
  },
  {
    id: 3,
    name: "Samuel Mensah",
    location: "Kumasi, Ghana",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    partPurchased: "Mercedes W124 Side Mirror",
    review: "I own a vintage 1992 Mercedes W124 and finding parts is usually impossible. PartMatch connected me with a specialist dealer who had the exact side mirror I needed. The platform is a game-changer for classic car owners!",
    helpful: 31
  },
  {
    id: 4,
    name: "Fatima Ibrahim",
    location: "Kano, Nigeria",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    date: "2 months ago",
    verified: true,
    partPurchased: "Nissan Sentra Headlight Assembly",
    review: "Great experience overall. The search filters helped me find the right part for my Sentra quickly. The seller was responsive and the part arrived in perfect condition. Only wish there were more payment options.",
    helpful: 15
  },
  {
    id: 5,
    name: "Emmanuel Ofori",
    location: "Tema, Ghana",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    verified: true,
    partPurchased: "Toyota Camry Water Pump",
    review: "As a mechanic, I need reliable parts suppliers. PartMatch has become my go-to platform. The quality verification system gives me confidence, and my customers are always satisfied. This platform is revolutionizing the auto parts industry in Ghana!",
    helpful: 42
  },
  {
    id: 6,
    name: "Grace Adebayo",
    location: "Ibadan, Nigeria",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "3 days ago",
    verified: true,
    partPurchased: "Honda Accord Engine Mount",
    review: "Fantastic platform! Posted a request for a hard-to-find engine mount and got 3 responses within hours. The competitive pricing helped me save money while getting a quality part. Will definitely use again!",
    helpful: 8
  }
];

const Testimonials = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 3;

  const filteredTestimonials = selectedRating 
    ? testimonials.filter(t => t.rating === selectedRating)
    : testimonials;

  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(startIndex, startIndex + testimonialsPerPage);

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;

  const ratingDistribution = {
    5: testimonials.filter(t => t.rating === 5).length,
    4: testimonials.filter(t => t.rating === 4).length,
    3: testimonials.filter(t => t.rating === 3).length,
    2: testimonials.filter(t => t.rating === 2).length,
    1: testimonials.filter(t => t.rating === 1).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Customer Testimonials
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            See what our customers say about their experience finding and selling car parts on PartMatch
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{totalReviews}</div>
              <div className="text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfied Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Rating Distribution */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Filter Reviews</h3>
                
                <div className="space-y-4">
                  <Button
                    variant={selectedRating === null ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedRating(null);
                      setCurrentPage(1);
                    }}
                  >
                    All Reviews ({totalReviews})
                  </Button>
                  
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => {
                        setSelectedRating(rating);
                        setCurrentPage(1);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        {rating} Stars
                      </div>
                      <span>({ratingDistribution[rating]})</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {currentTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-card border shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-foreground">{testimonial.name}</h4>
                              {testimonial.verified && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              {testimonial.location}
                              <Calendar className="w-4 h-4 ml-4 mr-1" />
                              {testimonial.date}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {testimonial.partPurchased}
                            </Badge>
                          </div>
                        </div>
                        
                        <Quote className="w-8 h-8 text-primary/20 mb-4" />
                        <p className="text-foreground leading-relaxed mb-4">
                          {testimonial.review}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {testimonial.helpful} people found this helpful
                          </span>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                      className="w-10 h-10 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Thousands of Satisfied Customers
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start finding the car parts you need or sell your inventory to customers across Ghana and Nigeria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/search-parts">
                Find Car Parts
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/seller-auth">
                Start Selling
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Testimonials;