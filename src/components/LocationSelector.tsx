
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

interface Region {
  id: string;
  name: string;
  major_cities: string[];
}

const LocationSelector = ({ value, onChange, required = false }: LocationSelectorProps) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('ghana_regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleRegionChange = (regionName: string) => {
    setSelectedRegion(regionName);
    const region = regions.find(r => r.name === regionName);
    if (region) {
      setCities(region.major_cities);
      // Reset city selection when region changes
      onChange("");
    }
  };

  const handleCityChange = (city: string) => {
    onChange(city);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Region {required && "*"}</Label>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.id} value={region.name}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRegion && (
        <div>
          <Label>City/Town {required && "*"}</Label>
          <Select value={value} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select city/town" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
              <SelectItem value="other">Other (specify in description)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
