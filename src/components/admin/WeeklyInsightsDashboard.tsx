import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import AutoInsightsHeader from '@/components/admin/AutoInsightsHeader';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  MapPin,
  Star,
  Eye,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WeeklyInsightsData {
  topViewedListings: any[];
  mostRequestedParts: any[];
  topSellers: any[];
  regionalActivity: any[];
  revenueEstimate: number;
  growthSummary: {
    newUsers: number;
    newListings: number;
    conversionRate: number;
  };
  warnings: string[];
  weeklyTrends: any[];
}

interface InsightNotification {
  id: string;
  message: string;
  metadata: any; // Using any for JSON type from Supabase
  created_at: string;
}

const WeeklyInsightsDashboard = () => {
  const navigate = useNavigate();
  const [latestInsights, setLatestInsights] = useState<InsightNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestInsights();
  }, []);

  const fetchLatestInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('type', 'weekly_insights')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setLatestInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Error",
        description: "Failed to fetch latest insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-insight-agent');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weekly insights generated successfully",
      });

      // Wait a moment for the database transaction to complete
      setTimeout(async () => {
        await fetchLatestInsights();
      }, 2000);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!latestInsights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Insights
          </CardTitle>
          <CardDescription>
            No insights available yet. Generate your first weekly report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateNewInsights} disabled={generating}>
            {generating && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            Generate Weekly Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  const insights = latestInsights.metadata.insights;
  const generatedDate = new Date(latestInsights.metadata.generated_at).toLocaleDateString();

  return (
    <div className="space-y-6">
      <AutoInsightsHeader />
      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{latestInsights.message}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.growthSummary.newUsers}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.growthSummary.newListings}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${insights.revenueEstimate}</div>
            <p className="text-xs text-muted-foreground">From monetization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.growthSummary.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Offer acceptance</p>
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {insights.warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {insights.warnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Top Listings</TabsTrigger>
          <TabsTrigger value="requests">Popular Requests</TabsTrigger>
          <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
          <TabsTrigger value="regions">Regional Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Top 10 Most Viewed Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topViewedListings.map((listing, index) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.make} {listing.model} - {listing.profiles?.first_name} {listing.profiles?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{listing.view_count} views</p>
                      <p className="text-sm text-muted-foreground">{listing.currency} {listing.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Most Requested Parts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.mostRequestedParts.map((part, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="capitalize">{part.part_type}</span>
                    <Badge variant="outline">{part.request_count} requests</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topSellers.map((seller, index) => (
                  <div key={seller.seller_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{seller.seller_name || 'Anonymous Seller'}</p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {seller.rating.toFixed(1)} ⭐
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{seller.listing_count} listings</p>
                      <p className="text-sm text-muted-foreground">
                        {seller.featured_count} featured, {seller.boosted_count} boosted
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.regionalActivity.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{region.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32">
                        <Progress value={(region.user_count / Math.max(...insights.regionalActivity.map(r => r.user_count))) * 100} />
                      </div>
                      <Badge variant="outline">{region.user_count} users</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyInsightsDashboard;