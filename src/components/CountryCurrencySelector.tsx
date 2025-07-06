import React, { useState } from 'react';
import { Check, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSupportedCountries, getCountryConfig, getCurrencySymbol } from '@/lib/countryConfig';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CountryCurrencySelectorProps {
  trigger?: 'button' | 'card';
  showCurrencyInfo?: boolean;
  onCountryChange?: (countryCode: string, currency: string) => void;
}

const CountryCurrencySelector = ({ 
  trigger = 'button', 
  showCurrencyInfo = true,
  onCountryChange 
}: CountryCurrencySelectorProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const countries = getSupportedCountries();
  const currentCountry = getCountryConfig(selectedCountry);

  const handleCountrySelect = async (countryCode: string) => {
    const country = getCountryConfig(countryCode);
    if (!country || !user) return;

    setLoading(true);
    try {
      // Update user profile with new country and currency
      const { error } = await supabase
        .from('profiles')
        .update({
          country: country.name,
          currency: country.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSelectedCountry(countryCode);
      setOpen(false);
      
      toast({
        title: "Country Updated",
        description: `Your location has been set to ${country.name} and currency to ${country.currency} (${getCurrencySymbol(country.currency)})`,
      });

      // Call the callback if provided
      onCountryChange?.(countryCode, country.currency);
    } catch (error) {
      console.error('Error updating country:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your country. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const TriggerButton = React.forwardRef<HTMLButtonElement>((props, ref) => (
    <Button 
      {...props}
      ref={ref}
      variant="outline" 
      role="combobox"
      aria-expanded={open}
      className="justify-between min-w-[200px]"
      disabled={loading}
    >
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {currentCountry ? (
          <span>{currentCountry.flag} {currentCountry.name}</span>
        ) : (
          <span>Select Country</span>
        )}
      </div>
      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  ));

  const TriggerCard = () => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Country & Currency</CardTitle>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        <CardDescription>
          {currentCountry ? (
            <span className="flex items-center gap-2">
              {currentCountry.flag} {currentCountry.name} • {getCurrencySymbol(currentCountry.currency)} {currentCountry.currency}
            </span>
          ) : (
            "Select your country to set currency"
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  const CountrySelector = () => (
    <Command>
      <CommandInput placeholder="Search countries..." />
      <CommandList>
        <CommandEmpty>No country found.</CommandEmpty>
        <CommandGroup>
          {countries.map((country) => (
            <CommandItem
              key={country.code}
              value={country.name}
              onSelect={() => handleCountrySelect(country.code)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{country.flag}</span>
                  <div>
                    <div className="font-medium">{country.name}</div>
                    {showCurrencyInfo && (
                      <div className="text-sm text-muted-foreground">
                        {getCurrencySymbol(country.currency)} {country.currency}
                      </div>
                    )}
                  </div>
                </div>
                <Check
                  className={`h-4 w-4 ${
                    selectedCountry === country.code ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (trigger === 'card') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <TriggerCard />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Select Your Country
            </DialogTitle>
            <DialogDescription>
              Choose your country to automatically set the appropriate currency for pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-hidden">
            <CountrySelector />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <CountrySelector />
      </PopoverContent>
    </Popover>
  );
};

export default CountryCurrencySelector;