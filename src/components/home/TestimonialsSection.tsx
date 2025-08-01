import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Got a rare part in 48hrs from a trusted seller on PartMatch!",
      author: "Kwame",
      location: "Accra",
      rating: 5
    },
    {
      text: "Love the chat feature – made buying so easy!",
      author: "Amina",
      location: "Lagos",
      rating: 5
    },
    {
      text: "PartMatch helped me find parts for my vintage car. Amazing service!",
      author: "Samuel",
      location: "Kumasi",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Real feedback from satisfied customers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-0 shadow-xl relative overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
              
              <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <cite className="text-lg font-semibold text-primary">
                – {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].location}
              </cite>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-primary/30'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/testimonials">
                Read More Reviews
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;