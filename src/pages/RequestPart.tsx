
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Car, ArrowLeft, Upload, CheckCircle } from "lucide-react";
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
        <Card className="w-full max-w-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-6">
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
      <header className="p-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Request a Part</h1>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-6 max-w-lg">
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Tell us what you need</h2>
            <p className="text-gray-600 text-sm">We'll connect you with local suppliers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="make">Car Make *</Label>
              <Input
                id="make"
                placeholder="e.g. Toyota"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g. Corolla"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g. 2015"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="part">Part Needed *</Label>
              <Input
                id="part"
                placeholder="e.g. Alternator, Brake Pads"
                value={formData.part}
                onChange={(e) => handleInputChange('part', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Any specific details about the part..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Your Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Accra, Kumasi"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone/WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +233 20 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Upload Photo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tap to upload a photo of the part</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg rounded-xl">
              Send Request
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default RequestPart;
