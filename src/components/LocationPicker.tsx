
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with Ghana as center
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2x6dzZkdXZiMDEyMzJqcGEwMzQyM2xlMSJ9.UKvTlBGGqFXJ9kEF7Q6GnA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [-0.1870, 5.6037], // Accra, Ghana
      zoom: initialLocation ? 14 : 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Add or update marker
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const place = data.features[0];
        const addressText = place?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        setAddress(addressText);
        onLocationSelect({ lat, lng, address: addressText });
      } catch (error) {
        console.error('Error getting address:', error);
        const addressText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(addressText);
        onLocationSelect({ lat, lng, address: addressText });
      }
    });

    // Add initial marker if location provided
    if (initialLocation) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const searchLocation = async () => {
    if (!address.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&country=GH`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const addressText = data.features[0].place_name;
        
        // Update map view
        map.current?.flyTo({ center: [lng, lat], zoom: 14 });
        
        // Add or update marker
        if (marker.current) {
          marker.current.remove();
        }
        
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
        
        setAddress(addressText);
        onLocationSelect({ lat, lng, address: addressText });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-search">Search Location</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="address-search"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or place name"
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          />
          <Button
            type="button"
            onClick={searchLocation}
            disabled={isLoading}
            className="px-3"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="h-64 w-full rounded-lg border" />
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Click on map to set location
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
