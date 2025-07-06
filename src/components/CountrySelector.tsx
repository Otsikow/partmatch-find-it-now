import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Globe, Check } from 'lucide-react';
import { useCountryDetection, Country, SUPPORTED_COUNTRIES } from '@/hooks/useCountryDetection';

interface CountrySelectorProps {
  onCountrySelect?: (country: Country) => void;
  showTrigger?: boolean;
  children?: React.ReactNode;
}

const CountrySelector = ({ onCountrySelect, showTrigger = true, children }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const { country: selectedCountry, setCountry, detectCountry, loading } = useCountryDetection();

  const handleCountrySelect = (country: Country) => {
    setCountry(country);
    onCountrySelect?.(country);
    setOpen(false);
  };

  const handleDetectLocation = async () => {
    const detectedCountry = await detectCountry();
    if (detectedCountry && onCountrySelect) {
      onCountrySelect(detectedCountry);
      setOpen(false);
    }
  };

  const trigger = children || (
    <Button variant="outline" className="gap-2">
      <Globe className="h-4 w-4" />
      {selectedCountry ? (
        <>
          {selectedCountry.flag} {selectedCountry.name}
        </>
      ) : (
        'Select Country'
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select Your Country
          </DialogTitle>
          <DialogDescription>
            Choose your country to see relevant car parts and pricing in your local currency.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto-detect button */}
          <Button
            onClick={handleDetectLocation}
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

          {/* Country list */}
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {SUPPORTED_COUNTRIES.map((country) => (
              <Card
                key={country.code}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedCountry?.code === country.code ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCountrySelect(country)}
              >
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Currency: {country.currency}
                      </div>
                    </div>
                  </div>
                  {selectedCountry?.code === country.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountrySelector;