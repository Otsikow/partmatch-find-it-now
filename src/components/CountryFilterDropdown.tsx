
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { Globe } from 'lucide-react';

interface CountryFilterDropdownProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const CountryFilterDropdown = ({ selectedCountry, onCountryChange }: CountryFilterDropdownProps) => {
  const { supportedCountries } = useCountryDetection();

  const getDisplayValue = () => {
    if (selectedCountry === 'all') {
      return 'All Countries';
    }
    const country = supportedCountries.find(c => c.code === selectedCountry);
    return country ? `${country.flag} ${country.name}` : 'Select Country';
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[180px] border-input bg-background">
          <SelectValue placeholder="Select country">
            {getDisplayValue()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>All Countries</span>
            </div>
          </SelectItem>
          {supportedCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryFilterDropdown;
