import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, MapPin, Languages, CheckCircle2 } from 'lucide-react';
import { useCountryDetection, Country, SUPPORTED_COUNTRIES } from '@/hooks/useCountryDetection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProfileOnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const ProfileOnboardingModal = ({ open, onComplete }: ProfileOnboardingModalProps) => {
  const { user } = useAuth();
  const { country: detectedCountry, detectCountry, loading: detectingLocation } = useCountryDetection();
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    language: 'en',
    currency: 'GHS'
  });
  const [saving, setSaving] = useState(false);

  // Auto-set detected country
  useEffect(() => {
    if (detectedCountry && !formData.country) {
      setFormData(prev => ({
        ...prev,
        country: detectedCountry.name,
        currency: detectedCountry.currency
      }));
    }
  }, [detectedCountry, formData.country]);

  // Auto-set currency based on country
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.name === formData.country);
      if (selectedCountry && selectedCountry.currency !== formData.currency) {
        setFormData(prev => ({ ...prev, currency: selectedCountry.currency }));
      }
    }
  }, [formData.country, formData.currency]);

  const handleCountrySelect = (country: Country) => {
    setFormData(prev => ({
      ...prev,
      country: country.name,
      currency: country.currency
    }));
  };

  const handleAutoDetect = async () => {
    const detected = await detectCountry();
    if (detected) {
      handleCountrySelect(detected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          country: formData.country,
          city: formData.city,
          language: formData.language,
          currency: formData.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your location and preferences have been saved.",
      });

      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">{/* Prevent closing until completed */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-6 w-6 text-primary" />
            Complete Your Profile
          </DialogTitle>
          <DialogDescription>
            Help us personalize your experience by sharing your location and preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-detect location */}
          <div className="text-center">
            <Button
              type="button"
              onClick={handleAutoDetect}
              disabled={detectingLocation}
              variant="outline"
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              {detectingLocation ? 'Detecting...' : 'Auto-detect my location'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or set manually</span>
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <Label className="text-base font-medium">Country *</Label>
            <div className="grid gap-2 mt-2 max-h-32 overflow-y-auto">
              {SUPPORTED_COUNTRIES.map((country) => (
                <Card
                  key={country.code}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    formData.country === country.name ? 'ring-2 ring-primary bg-accent' : ''
                  }`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <div>
                        <div className="font-medium">{country.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Currency: {country.currency}
                        </div>
                      </div>
                    </div>
                    {formData.country === country.name && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city" className="text-base font-medium">City/Town *</Label>
            <Input
              id="city"
              placeholder="e.g. Accra, Lagos, Nairobi"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
              className="mt-2"
            />
          </div>

          {/* Language and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language" className="text-base font-medium">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="fr">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Français
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency" className="text-base font-medium">Currency</Label>
              <Input
                id="currency"
                value={formData.currency}
                readOnly
                className="mt-2 bg-muted"
                placeholder="Auto-set"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving || !formData.country || !formData.city}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Complete Setup'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileOnboardingModal;