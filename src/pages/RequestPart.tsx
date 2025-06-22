
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const RequestPart = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    part: '',
    description: '',
    phone: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate submission
    console.log('Part request submitted:', formData);
    
    // Show success state
    setSubmitted(true);
    
    toast({
      title: "Request Submitted!",
      description: "We'll contact you when a supplier is found.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            We're finding your part. You'll be contacted via WhatsApp soon.
          </p>
          <Link to="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8"
          />
          <h1 className="text-lg sm:text-xl font-bold">Request a Part</h1>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Tell us what you need</h2>
            <p className="text-gray-600 text-sm">We'll connect you with local suppliers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="make" className="text-sm">Car Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g. Toyota"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="model" className="text-sm">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g. Corolla"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="year" className="text-sm">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g. 2015"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="part" className="text-sm">Part Needed *</Label>
              <Input
                id="part"
                placeholder="e.g. Alternator, Brake Pads"
                value={formData.part}
                onChange={(e) => handleInputChange('part', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Any specific details about the part..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="mt-1 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="location" className="text-sm">Your Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Accra, Kumasi"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Phone/WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +233 20 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Upload Photo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors cursor-pointer mt-1">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Tap to upload a photo of the part</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 sm:py-3 text-base sm:text-lg rounded-xl mt-6">
              Send Request
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default RequestPart;
