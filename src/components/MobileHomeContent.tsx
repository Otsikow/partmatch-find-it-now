
import { Search, Plus, Package, Zap, ClipboardList, Newspaper, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedParts } from "@/hooks/useFeaturedParts";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from '@/components/BlogCard';
import { useTranslation } from 'react-i18next';
import enginePartsImage from "@/assets/engine-parts.jpg";
import brakeSystemImage from "@/assets/brake-system.jpg";
import suspensionImage from "@/assets/suspension.jpg";
import bodyPartsImage from "@/assets/body-parts.jpg";

const MobileHomeContent = () => {
  const { t } = useTranslation();
  const { featuredParts, loading: featuredLoading } = useFeaturedParts();
  const {
    activeParts,
    activeRequests,
    partsMatched,
    sellers,
    totalUsers,
    countries,
    categories,
    loading
  } = useRealTimeStats();
  const { posts: blogPosts, loading: blogLoading } = useBlogPosts(3);

  const categoryImages = {
    engine: enginePartsImage,
    brake: brakeSystemImage,
    suspension: suspensionImage,
    body: bodyPartsImage,
    accessories: "" // Use empty string for accessories, will show fallback icon
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
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('heroTitle')}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{t('heroSubtitle')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">{t('quickActions')}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/search-parts-with-map">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t('browse')}</h4>
                  <p className="text-xs text-muted-foreground">{t('findAvailableParts')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/request-part">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t('request')}</h4>
                  <p className="text-xs text-muted-foreground">{t('cantFindAskHere')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Link to="/requested-car-parts">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto">
                  <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t('requestedCarParts')}</h4>
                  <p className="text-xs text-muted-foreground">{t('browseAndRespondRequests')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/post-part">
            <Card className="h-full">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t('sellCarParts')}</h4>
                  <p className="text-xs text-muted-foreground">{t('listPartsForSale')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Featured Parts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{t('featuredParts')}</h3>
          <Link to="/search-parts-with-map" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            {t('viewAll')}
          </Link>
        </div>
        
        {featuredLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-3"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-1"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredParts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {featuredParts.slice(0, 4).map((part) => (
              <Link key={part.id} to={`/search-parts-with-map`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto">
                      {part.images && part.images.length > 0 ? (
                        <img
                          src={part.images[0]}
                          alt={part.title}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{part.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {part.currency} {part.price}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-muted-foreground">No featured parts available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">{t('popularCategories')}</h3>
        
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
            },
            {
              name: "Car Accessories",
              count: loading ? "..." : `${categories.accessories || 0}+ ${t('parts')}`,
              image: categoryImages.accessories
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
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.count}</p>
                    </div>
                  </div>
                  <div className="text-gray-400 dark:text-gray-600">
                    →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* From the Blog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Auto Insights</h3>
          <Link to="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            {t('viewAll')}
          </Link>
        </div>

        {blogLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block">
                <BlogCard post={post} />
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Newspaper className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-muted-foreground">No blog posts available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6">
        <div className="text-center space-y-2">
          <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
          <h3 className="font-semibold text-foreground">{t('fastReliable')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('connectWithSellers')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {loading ? '...' : `${activeParts}+`}
            </div>
            <div className="text-xs text-muted-foreground">{t('activeParts')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {loading ? '...' : `${sellers}+`}
            </div>
            <div className="text-xs text-muted-foreground">{t('sellers')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {loading ? '...' : `${totalUsers}+`}
            </div>
            <div className="text-xs text-muted-foreground">{t('users')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {loading ? '...' : `${countries}+`}
            </div>
            <div className="text-xs text-muted-foreground">{t('countries')}</div>
          </div>
        </div>

        {/* Additional Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {loading ? '...' : `${activeRequests}+`}
            </div>
            <div className="text-xs text-foreground font-medium">Active Requests</div>
            <p className="text-xs text-muted-foreground mt-1">Live requests waiting for offers</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {loading ? '...' : `${partsMatched}+`}
            </div>
            <div className="text-xs text-foreground font-medium">Parts Matched</div>
            <p className="text-xs text-muted-foreground mt-1">Successful connections made</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeContent;
