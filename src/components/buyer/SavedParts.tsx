
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Heart, 
  MessageSquare, 
  Eye, 
  MapPin,
  Star,
  Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSavedParts } from "@/hooks/useSavedParts";
import { useIsMobile } from "@/hooks/use-mobile";

const SavedParts = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { savedParts, loading, removeSavedPart } = useSavedParts();
  const isMobile = useIsMobile();

  const filteredParts = savedParts.filter(part =>
    part.car_parts.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.car_parts.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.car_parts.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 lg:p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{t('savedParts')}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredParts.length} {t('savedItems')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('searchSavedParts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {t('filter')}
          </Button>
        </div>
      </div>

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredParts.map((savedPart) => (
            <Card key={savedPart.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {savedPart.car_parts.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {savedPart.car_parts.make} {savedPart.car_parts.model}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {savedPart.car_parts.year}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSavedPart(savedPart.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {savedPart.car_parts.currency} {savedPart.car_parts.price?.toLocaleString()}
                    </span>
                    <Badge 
                      variant={savedPart.car_parts.condition === 'new' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {savedPart.car_parts.condition}
                    </Badge>
                  </div>
                  
                  {savedPart.car_parts.city && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{savedPart.car_parts.city}</span>
                    </div>
                  )}

                  {savedPart.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>{t('notes')}:</strong> {savedPart.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" className="flex-1 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('viewDetails')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {t('contact')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? t('noSavedPartsFound') : t('noSavedParts')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? t('tryDifferentSearch') 
                : t('startSavingParts')
              }
            </p>
            <Button asChild>
              <a href="/search-parts">{t('browseParts')}</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedParts;
