import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { useCountryDetection, Country, SUPPORTED_COUNTRIES } from '@/hooks/useCountryDetection';

interface CountryOnboardingProps {
  onComplete: (country: Country) => void;
}

const CountryOnboarding = ({ onComplete }: CountryOnboardingProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const { detectCountry, loading } = useCountryDetection();

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleContinue = () => {
    if (selectedCountry) {
      localStorage.setItem('selectedCountry', selectedCountry.code);
      onComplete(selectedCountry);
    }
  };

  const handleAutoDetect = async () => {
    const detectedCountry = await detectCountry();
    if (detectedCountry) {
      setSelectedCountry(detectedCountry);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Welcome to PartMatch!</CardTitle>
          <CardDescription>
            Let's get started by selecting your country to show you relevant car parts and local pricing.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Auto-detect button */}
          <Button
            onClick={handleAutoDetect}
            disabled={loading}
            variant="outline"
            className="w-full gap-2"
          >
            <MapPin className="h-4 w-4" />
            {loading ? 'Detecting...' : 'Auto-detect my location'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or choose manually</span>
            </div>
          </div>

          {/* Country selection */}
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {SUPPORTED_COUNTRIES.map((country) => (
              <Card
                key={country.code}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedCountry?.code === country.code ? 'ring-2 ring-primary bg-accent' : ''
                }`}
                onClick={() => handleCountrySelect(country)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Currency: {country.currency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedCountry}
            className="w-full gap-2"
          >
            Continue to PartMatch
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryOnboarding;