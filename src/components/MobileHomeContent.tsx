
import { Search, Plus, Package, Zap, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import { useTranslation } from 'react-i18next';

const MobileHomeContent = () => {
  const { t } = useTranslation();
  const {
    activeParts,
    sellers,
    totalUsers,
    countries,
    categories,
    loading
  } = useRealTimeStats();

  const categoryImages = {
    engine: "/src/assets/engine-parts.jpg",
    brake: "/src/assets/brake-system.jpg",
    suspension: "/src/assets/suspension.jpg",
    body: "/src/assets/body-parts.jpg"
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <div className="mx-auto">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-44 w-auto mx-auto" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('heroTitle')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{t('heroSubtitle')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{t('quickActions')}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/search-parts-with-map">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('browse')}</h4>
                  <p className="text-xs text-gray-500">{t('findAvailableParts')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/request-part">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('request')}</h4>
                  <p className="text-xs text-gray-500">{t('cantFindAskHere')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Link to="/requested-car-parts">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('requestedCarParts')}</h4>
                  <p className="text-xs text-gray-500">{t('browseAndRespondRequests')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller-dashboard">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('sellCarParts')}</h4>
                  <p className="text-xs text-gray-500">{t('listPartsForSale')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{t('popularCategories')}</h3>
        
        <div className="space-y-2">
          {[
            {
              name: t('engineParts'),
              count: loading ? "..." : `${categories.engineParts}+ ${t('parts')}`,
              image: categoryImages.engine
            },
            {
              name: t('brakeSystem'),
              count: loading ? "..." : `${categories.brakeParts}+ ${t('parts')}`,
              image: categoryImages.brake
            },
            {
              name: t('suspension'),
              count: loading ? "..." : `${categories.suspensionParts}+ ${t('parts')}`,
              image: categoryImages.suspension
            },
            {
              name: t('bodyParts'),
              count: loading ? "..." : `${categories.bodyParts}+ ${t('parts')}`,
              image: categoryImages.body
            }
          ].map((category) => (
            <Link key={category.name} to="/search-parts-with-map" className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('bg-blue-100', 'flex', 'items-center', 'justify-center');
                            parent.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>';
                          }
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
        <div className="text-center space-y-2">
          <Zap className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="font-semibold text-gray-900">{t('fastReliable')}</h3>
          <p className="text-sm text-gray-600">
            {t('connectWithSellers')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {loading ? '...' : `${activeParts}+`}
            </div>
            <div className="text-xs text-gray-500">{t('activeParts')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {loading ? '...' : `${sellers}+`}
            </div>
            <div className="text-xs text-gray-500">{t('sellers')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {loading ? '...' : `${totalUsers}+`}
            </div>
            <div className="text-xs text-gray-500">{t('users')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">
              {loading ? '...' : `${countries}+`}
            </div>
            <div className="text-xs text-gray-500">{t('countries')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeContent;
