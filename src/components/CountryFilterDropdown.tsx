
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

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
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
