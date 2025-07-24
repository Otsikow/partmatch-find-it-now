// **Step 8: Admin Country Filters**

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { getSupportedCountries } from '@/lib/countryConfig';
import { useTranslation } from 'react-i18next';

interface CountryFilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  showAllOption?: boolean;
  label?: string;
  placeholder?: string;
}

const CountryFilterSelect = ({ 
  value, 
  onValueChange, 
  showAllOption = true,
  label,
  placeholder = "All Countries"
}: CountryFilterSelectProps) => {
  const { t } = useTranslation();
  const countries = getSupportedCountries();

  return (
    <div className="space-y-2">
      {label && (
        <Label className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full min-w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                All Countries
              </div>
            </SelectItem>
          )}
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-xs text-muted-foreground">({country.currency})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryFilterSelect;