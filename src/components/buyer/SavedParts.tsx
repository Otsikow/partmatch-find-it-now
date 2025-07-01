
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, ExternalLink, Trash2, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useSavedParts } from '@/hooks/useSavedParts';
import ChatButton from '@/components/chat/ChatButton';
import { useNavigate } from 'react-router-dom';

const SavedParts = () => {
  const { savedParts, loading, removeSavedPart } = useSavedParts();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleRemoveSaved = async (partId: string) => {
    await removeSavedPart(partId);
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredParts = savedParts.filter(item =>
    item.car_parts.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${item.car_parts.make} ${item.car_parts.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Parts</h2>
          <p className="text-gray-600 mt-1">Your wishlist of car parts ({savedParts.length} items)</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search saved parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredParts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved parts</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'No saved parts match your search.'
                : 'Start browsing and save parts you\'re interested in.'
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/search-parts')}
            >
              Browse Parts
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredParts.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow group">
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {item.car_parts.images && item.car_parts.images.length > 0 ? (
                  <img
                    src={item.car_parts.images[0]}
                    alt={item.car_parts.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className={getConditionColor(item.car_parts.condition)}>
                    {item.car_parts.condition}
                  </Badge>
                </div>
                <button
                  onClick={() => handleRemoveSaved(item.part_id)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </button>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{item.car_parts.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.car_parts.make} {item.car_parts.model} ({item.car_parts.year})
                    </p>
                    <p className="text-green-600 font-bold text-lg">
                      {item.car_parts.currency} {item.car_parts.price.toLocaleString()}
                    </p>
                  </div>

                  {item.car_parts.address && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{item.car_parts.address}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Saved {format(new Date(item.created_at), 'MMM dd, yyyy')}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <ChatButton
                      sellerId={item.car_parts.supplier_id}
                      partId={item.car_parts.id}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveSaved(item.part_id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedParts;
