
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, DollarSign, Calendar, Trash2 } from 'lucide-react';

const SavedParts = () => {
  const savedParts = [
    {
      id: '1',
      title: 'Brake pads - Front set',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      price: '$45.99',
      condition: 'New',
      location: 'Accra, Ghana',
      savedDate: '2024-01-15',
      seller: 'AutoParts Plus'
    },
    {
      id: '2',
      title: 'Oil filter - Premium',
      make: 'Honda',
      model: 'Civic',
      year: '2019',
      price: '$12.50',
      condition: 'New',
      location: 'Kumasi, Ghana',
      savedDate: '2024-01-18',
      seller: 'Quick Parts'
    }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-yellow-100 text-yellow-800';
      case 'refurbished':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Saved parts</h2>
        <p className="text-sm text-gray-600">{savedParts.length} saved items</p>
      </div>

      {savedParts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved parts</h3>
            <p className="text-gray-600 mb-4">Save parts you're interested in to view them later.</p>
            <Button>Browse parts</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedParts.map((part) => (
            <Card key={part.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {part.title}
                  </CardTitle>
                  <Badge className={getConditionColor(part.condition)}>
                    {part.condition}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {part.make} {part.model} {part.year}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{part.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{part.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Saved: {part.savedDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Seller: {part.seller}</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <Button size="sm">Contact seller</Button>
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
