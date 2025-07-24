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
  Star,
  Clock,
  FileText,
  Sparkles
} from 'lucide-react';

interface AiReview {
  score: number;
  issues: string[];
  feedback: string;
}

interface QualityCheck {
  id: string;
  listing_id: string;
  quality_score: number;
  feedback_message: string;
  flagged_issues: any;
  auto_approved: boolean;
  checked_at: string;
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

interface QualityStats {
  total_checks: number;
  auto_approved: number;
  pending_fixes: number;
  avg_quality_score: number;
}

const ListingQualityManager = () => {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [stats, setStats] = useState<QualityStats>({
    total_checks: 0,
    auto_approved: 0,
    pending_fixes: 0,
    avg_quality_score: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [aiReviewing, setAiReviewing] = useState<string | null>(null);

  useEffect(() => {
    fetchQualityData();
  }, []);

  const fetchQualityData = async () => {
    try {
      setLoading(true);
      
      const { data: checksData, error: checksError } = await supabase
        .from('listing_quality_checks')
        .select(`
          *,
          car_part:car_parts!listing_id (
            id,
            title,
            description,
            price,
            currency,
            status,
            make,
            model,
            year,
            images,
            supplier_id,
            profiles!supplier_id (
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('checked_at', { ascending: false });

      if (checksError) throw checksError;

      setQualityChecks(checksData as QualityCheck[]);

      const totalChecks = checksData?.length || 0;
      const autoApproved = checksData?.filter(check => check.auto_approved).length || 0;
      const pendingFixes = totalChecks - autoApproved;
      const avgScore = totalChecks > 0 
        ? Math.round(checksData.reduce((sum, check) => sum + check.quality_score, 0) / totalChecks)
        : 0;

      setStats({
        total_checks: totalChecks,
        auto_approved: autoApproved,
        pending_fixes: pendingFixes,
        avg_quality_score: avgScore
      });

    } catch (error) {
      console.error('Error fetching quality data:', error);
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

      fetchQualityData();
    } catch (error) {
      console.error('Error approving listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve listing.',
        variant: 'destructive'
      });
    }
  };

  const handleRerunQualityCheck = async (listing: QualityCheck['car_part']) => {
    try {
      const { error } = await supabase.functions.invoke('listing-quality-checker', {
        body: {
          listingId: listing.id,
          title: listing.title,
          description: listing.description,
          images: listing.images,
          price: listing.price,
          supplier_id: listing.supplier_id,
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Quality check re-run successfully.'
      });

      fetchQualityData();
    } catch (error) {
      console.error('Error re-running quality check:', error);
      toast({
        title: 'Error',
        description: 'Failed to re-run quality check.',
        variant: 'destructive'
      });
    }
  };

  const handleAiReview = async (listingId: string) => {
    try {
      setAiReviewing(listingId);
      const { error } = await supabase.functions.invoke('ai-listing-review', {
        body: { listingId }
      });

      if (error) throw error;

      toast({
        title: 'AI Review Started',
        description: 'The AI is analyzing the listing. Results will appear shortly.'
      });

      setTimeout(fetchQualityData, 3000); // Refresh data after a delay
    } catch (error) {
      console.error('Error triggering AI review:', error);
      toast({
        title: 'Error',
        description: 'Failed to start AI review.',
        variant: 'destructive'
      });
    } finally {
      setAiReviewing(null);
    }
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const filteredChecks = qualityChecks.filter(check => {
    if (activeTab === 'pending') return !check.auto_approved;
    if (activeTab === 'approved') return check.auto_approved;
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat cards ... */}
      </div>

      {/* Quality Checks Table */}
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
                Pending Fixes ({stats.pending_fixes})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Auto Approved ({stats.auto_approved})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({stats.total_checks})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredChecks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No quality checks found for this category.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChecks.map((check) => (
                    <Card key={check.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">
                                {check.car_part?.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {check.car_part?.make} {check.car_part?.model} {check.car_part?.year}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By: {check.car_part?.profiles?.first_name} {check.car_part?.profiles?.last_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getScoreBadgeVariant(check.quality_score)}>
                                Score: {check.quality_score}/100
                              </Badge>
                              {check.auto_approved ? (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Auto Approved
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
                          {Array.isArray(check.flagged_issues) && check.flagged_issues.length > 0 && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Issues Found:</strong>
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                  {check.flagged_issues.map((issue: string, index: number) => (
                                    <li key={index} className="text-sm">{issue}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Feedback */}
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm"><strong>Feedback:</strong></p>
                            <p className="text-sm mt-1">{check.feedback_message}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/parts/${check.listing_id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Listing
                            </Button>
                            
                            {!check.auto_approved && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleManualApprove(check.listing_id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Manual Approve
                                </Button>
                                
                                 <Button
                                   size="sm"
                                   variant="secondary"
                                   onClick={() => handleRerunQualityCheck(check.car_part)}
                                 >
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Re-check
                                </Button>
                              </>
                            )}
                            
                            <div className="ml-auto text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(check.checked_at).toLocaleDateString()}
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