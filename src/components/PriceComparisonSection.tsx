import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { useSimilarParts } from "@/hooks/useSimilarParts";
import { getConditionColor, formatPrice } from "@/utils/carPartUtils";
import ChatButton from "./chat/ChatButton";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import SellerRatingDisplay from "./SellerRatingDisplay";

interface PriceComparisonSectionProps {
  currentPart: CarPart;
}

type SortOption = 'price-asc' | 'price-desc' | 'condition' | 'location';
type FilterCondition = 'all' | 'New' | 'Used' | 'Refurbished';

const PriceComparisonSection = ({ currentPart }: PriceComparisonSectionProps) => {
  console.log('PriceComparisonSection: Component rendered for part:', currentPart.title);
  const { parts, loading, error } = useSimilarParts({ currentPart });
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  
  console.log('PriceComparisonSection: parts count:', parts.length, 'loading:', loading, 'error:', error);

  const uniqueLocations = useMemo(() => {
    const locations = parts
      .map(part => part.address?.split(',')[0]?.trim())
      .filter(Boolean)
      .filter((location, index, arr) => arr.indexOf(location) === index);
    return locations;
  }, [parts]);

  const filteredAndSortedParts = useMemo(() => {
    let filtered = parts;

    if (filterCondition !== 'all') {
      filtered = filtered.filter(part => part.condition === filterCondition);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(part => 
        part.address?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'condition':
          const conditionOrder = { 'New': 0, 'Refurbished': 1, 'Used': 2 };
          return conditionOrder[a.condition] - conditionOrder[b.condition];
        case 'location':
          return (a.address || '').localeCompare(b.address || '');
        default:
          return 0;
      }
    });

    return sorted;
  }, [parts, sortBy, filterCondition, filterLocation]);

  const lowestPrice = useMemo(() => {
    if (filteredAndSortedParts.length === 0) return null;
    return Math.min(...filteredAndSortedParts.map(part => part.price));
  }, [filteredAndSortedParts]);

  const getSellerName = (part: CarPart) => {
    return part.profiles?.first_name && part.profiles?.last_name 
      ? `${part.profiles.first_name} ${part.profiles.last_name}`.trim()
      : part.profiles?.first_name || part.profiles?.last_name || 'Seller';
  };

  const getSellerInitials = (sellerName: string) => {
    return sellerName === 'Seller' 
      ? 'S' 
      : sellerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">Error loading similar products: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (parts.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 text-base mb-2">No similar products found for comparison</div>
            <div className="text-gray-400 text-sm">Try browsing other {currentPart.part_type} parts</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Price Comparison ({parts.length} similar {parts.length === 1 ? 'product' : 'products'})
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" />
                  Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="price-desc">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Price: High to Low
                </div>
              </SelectItem>
              <SelectItem value="condition">Condition</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCondition} onValueChange={(value: FilterCondition) => setFilterCondition(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Refurbished">Refurbished</SelectItem>
            </SelectContent>
          </Select>

          {uniqueLocations.length > 0 && (
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location!}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedParts.map((part) => {
                const sellerName = getSellerName(part);
                const initials = getSellerInitials(sellerName);
                const isLowestPrice = part.price === lowestPrice;
                
                return (
                  <TableRow key={part.id} className={isLowestPrice ? "bg-green-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={part.profiles?.profile_photo_url} alt={sellerName} />
                          <AvatarFallback className="text-xs font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{sellerName}</span>
                            <VerifiedSellerBadge isVerified={part.profiles?.is_verified || false} size="sm" />
                          </div>
                          <SellerRatingDisplay
                            rating={part.profiles?.rating || 0}
                            totalRatings={part.profiles?.total_ratings || 0}
                            size="sm"
                            showBadge={false}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLowestPrice ? 'text-green-600 text-lg' : 'text-gray-900'}`}>
                          {formatPrice(part.price, part.currency, (part as any).country)}
                        </span>
                        {isLowestPrice && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Lowest Price
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(part.condition)}>
                        {part.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-32">{part.address?.split(',')[0] || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ChatButton
                          sellerId={part.supplier_id}
                          partId={part.id}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredAndSortedParts.map((part) => {
            const sellerName = getSellerName(part);
            const initials = getSellerInitials(sellerName);
            const isLowestPrice = part.price === lowestPrice;
            
            return (
              <Card key={part.id} className={`p-4 ${isLowestPrice ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={part.profiles?.profile_photo_url} alt={sellerName} />
                        <AvatarFallback className="text-sm font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{sellerName}</span>
                          <VerifiedSellerBadge isVerified={part.profiles?.is_verified || false} size="sm" />
                        </div>
                        <SellerRatingDisplay
                          rating={part.profiles?.rating || 0}
                          totalRatings={part.profiles?.total_ratings || 0}
                          size="sm"
                          showBadge={false}
                        />
                      </div>
                    </div>
                    <Badge className={getConditionColor(part.condition)}>
                      {part.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${isLowestPrice ? 'text-green-600' : 'text-gray-900'}`}>
                        {formatPrice(part.price, part.currency, (part as any).country)}
                      </span>
                      {isLowestPrice && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Lowest Price
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-24">{part.address?.split(',')[0] || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ChatButton
                      sellerId={part.supplier_id}
                      partId={part.id}
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceComparisonSection;
