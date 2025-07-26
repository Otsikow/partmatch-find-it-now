import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { AdminNotification } from '@/types/AdminNotification';

interface QualityNotification extends AdminNotification {
  car_part: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    status: string;
    make: string;
    model: string;
    year: number;
    images: string[];
    supplier_id: string;
    profiles: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

const ListingQualityManager = () => {
  const [notifications, setNotifications] = useState<QualityNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchQualityNotifications();
  }, []);

  const fetchQualityNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_notifications')
        .select(`
          *
        `)
        .eq('type', 'low_quality_listing')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For now, just use the basic admin notifications without car_part join
      setNotifications(data?.map(notification => ({
        ...notification,
        car_part: null
      })) as any || []);

    } catch (error) {
      console.error('Error fetching quality notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quality check data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualApprove = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .update({ 
          status: 'available',
          quality_checked_at: new Date().toISOString()
        })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Listing approved and made available.'
      });

      fetchQualityNotifications();
    } catch (error) {
      console.error('Error approving listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve listing.',
        variant: 'destructive'
      });
    }
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'pending') return !notification.read;
    if (activeTab === 'approved') return notification.read;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Listing Quality Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending Review ({notifications.filter(n => !n.read).length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Reviewed ({notifications.filter(n => n.read).length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No quality checks found for this category.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">
                                {notification.car_part?.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {notification.car_part?.make} {notification.car_part?.model} {notification.car_part?.year}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By: {notification.car_part?.profiles?.first_name} {notification.car_part?.profiles?.last_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getScoreBadgeVariant(notification.metadata?.quality_score || 0)}>
                                Score: {notification.metadata?.quality_score}/100
                              </Badge>
                              {notification.read ? (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Reviewed
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Needs Review
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Issues */}
                          {Array.isArray(notification.metadata?.issues) && notification.metadata?.issues.length > 0 && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Issues Found:</strong>
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                  {notification.metadata?.issues.map((issue: string, index: number) => (
                                    <li key={index} className="text-sm">{issue}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/parts/${notification.metadata?.listing_id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Listing
                            </Button>
                            
                            {!notification.read && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleManualApprove(notification.metadata?.listing_id || '')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark as Reviewed
                                </Button>
                              </>
                            )}
                            
                            <div className="ml-auto text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(notification.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingQualityManager;