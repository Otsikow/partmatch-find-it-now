import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CarPart } from '@/types/CarPart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, Calendar, Eye, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SUPPORTED_COUNTRIES } from '@/hooks/useCountryDetection';

interface FeaturedListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  make: string;
  model: string;
  year: number;
  is_featured: boolean;
  featured_country: string | null;
  featured_until: string | null;
  images: string[];
  status: string;
  supplier_id: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const FeaturedListingsManager = () => {
  const [listings, setListings] = useState<FeaturedListing[]>([]);
  const [availableListings, setAvailableListings] = useState<FeaturedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string>('');
  const [featureCountry, setFeatureCountry] = useState<string>('');
  const [featureEndDate, setFeatureEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    fetchFeaturedListings();
    fetchAvailableListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      console.log('FeaturedListingsManager: Fetching featured listings...');
      const { data, error } = await supabase
        .from('car_parts')
        .select(`
          id, title, price, currency, make, model, year, is_featured,
          featured_country, featured_until, images, status, supplier_id,
          created_at,
          profiles!car_parts_supplier_id_fkey (first_name, last_name)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('FeaturedListingsManager: Fetched listings:', data);
      console.log('FeaturedListingsManager: Nigeria listings:', data?.filter(l => l.featured_country === 'NG'));
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch featured listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableListings = async () => {
    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select(`
          id, title, price, currency, make, model, year, is_featured,
          featured_country, featured_until, images, status, supplier_id, created_at,
          profiles!car_parts_supplier_id_fkey (first_name, last_name)
        `)
        .eq('status', 'available')
        .eq('is_featured', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAvailableListings(data || []);
    } catch (error) {
      console.error('Error fetching available listings:', error);
    }
  };

  const handleFeatureListing = async () => {
    if (!selectedListing || !featureCountry) {
      toast({
        title: "Error",
        description: "Please select a listing and country",
        variant: "destructive"
      });
      return;
    }

    try {
      const updates: any = {
        is_featured: true,
        featured_country: featureCountry
      };

      if (featureEndDate) {
        updates.featured_until = new Date(featureEndDate).toISOString();
      }

      const { error } = await supabase
        .from('car_parts')
        .update(updates)
        .eq('id', selectedListing);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing featured successfully"
      });

      // Reset form and close modal
      setSelectedListing('');
      setFeatureCountry('');
      setFeatureEndDate('');
      setNotes('');
      setShowAddModal(false);

      // Refresh data
      fetchFeaturedListings();
      fetchAvailableListings();
    } catch (error) {
      console.error('Error featuring listing:', error);
      toast({
        title: "Error",
        description: "Failed to feature listing",
        variant: "destructive"
      });
    }
  };

  const handleUnfeatureListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .update({
          is_featured: false,
          featured_country: null,
          featured_until: null
        })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing unfeatured successfully"
      });

      fetchFeaturedListings();
      fetchAvailableListings();
    } catch (error) {
      console.error('Error unfeaturing listing:', error);
      toast({
        title: "Error",
        description: "Failed to unfeature listing",
        variant: "destructive"
      });
    }
  };

  const filteredListings = selectedCountry === 'all' 
    ? listings 
    : listings.filter(l => l.featured_country === selectedCountry);

  const getCountryName = (code: string) => {
    const country = SUPPORTED_COUNTRIES.find(c => c.code === code);
    return country ? `${country.flag} ${country.name}` : code;
  };

  const getCountryStats = () => {
    const stats = SUPPORTED_COUNTRIES.map(country => {
      const count = listings.filter(l => l.featured_country === country.code).length;
      return { country, count };
    });
    return stats.filter(s => s.count > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Countries Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCountryStats().length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available to Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableListings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Country Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Featured by Country
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCountryStats().map(({ country, count }) => (
              <div key={country.code} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{getCountryName(country.code)}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {SUPPORTED_COUNTRIES.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {getCountryName(country.code)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Featured Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Feature New Listing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="listing">Select Listing</Label>
                <Select value={selectedListing} onValueChange={setSelectedListing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a listing" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableListings.map(listing => (
                      <SelectItem key={listing.id} value={listing.id}>
                        {listing.title} - {listing.make} {listing.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Feature in Country</Label>
                <Select value={featureCountry} onValueChange={setFeatureCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_COUNTRIES.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {getCountryName(country.code)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="endDate">Feature Until (Optional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={featureEndDate}
                  onChange={(e) => setFeatureEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Reason for featuring, promotional notes, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFeatureListing} className="flex-1">
                  Feature Listing
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Featured Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Featured Listings {selectedCountry !== 'all' && `in ${getCountryName(selectedCountry)}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredListings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No featured listings found</p>
              {selectedCountry !== 'all' && <p className="text-sm">Try selecting a different country</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map(listing => (
                <div key={listing.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Listing Image */}
                    <div className="flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <Star className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.make} {listing.model} ({listing.year})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By: {listing.profiles?.first_name} {listing.profiles?.last_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {getCountryName(listing.featured_country || '')}
                        </Badge>
                        {listing.featured_until && (
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            Until {new Date(listing.featured_until).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col lg:items-end gap-2">
                      <p className="font-semibold">
                        {listing.currency} {listing.price.toLocaleString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfeatureListing(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Unfeature
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedListingsManager;