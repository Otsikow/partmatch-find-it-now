import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsData {
  userMetrics: {
    totalUsers: number;
    activeUsersThisWeek: number;
    activeUsersThisMonth: number;
    newSignupsData: { date: string; signups: number }[];
  };
  productMetrics: {
    totalParts: number;
    partsThisWeek: number;
    partsThisMonth: number;
    topRecentParts: { title: string; supplier: string; created_at: string }[];
    listingsData: { date: string; listings: number }[];
  };
  transactionMetrics: {
    totalOffers: number;
    successfulTransactions: number;
    totalRevenue: number;
    transactionData: { date: string; transactions: number; revenue: number }[];
  };
  otherMetrics: {
    verifiedSellers: number;
    verifiedBuyers: number;
    averageSellerRating: number;
  };
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const useAnalyticsData = (dateRange?: DateRange) => {
  const [data, setData] = useState<AnalyticsData>({
    userMetrics: {
      totalUsers: 0,
      activeUsersThisWeek: 0,
      activeUsersThisMonth: 0,
      newSignupsData: [],
    },
    productMetrics: {
      totalParts: 0,
      partsThisWeek: 0,
      partsThisMonth: 0,
      topRecentParts: [],
      listingsData: [],
    },
    transactionMetrics: {
      totalOffers: 0,
      successfulTransactions: 0,
      totalRevenue: 0,
      transactionData: [],
    },
    otherMetrics: {
      verifiedSellers: 0,
      verifiedBuyers: 0,
      averageSellerRating: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const startDate = dateRange?.startDate || monthAgo;
      const endDate = dateRange?.endDate || now;

      const [
        totalUsersResult,
        activeUsersWeekResult,
        activeUsersMonthResult,
        newSignupsResult,
        totalPartsResult,
        partsWeekResult,
        partsMonthResult,
        topPartsResult,
        listingsResult,
        totalOffersResult,
        successfulOffersResult,
        revenueResult,
        transactionDataResult,
        verifiedSellersResult,
        verifiedBuyersResult,
        ratingsResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        
        supabase.from('profiles')
          .select('id', { count: 'exact' })
          .gte('updated_at', weekAgo.toISOString()),
        
        supabase.from('profiles')
          .select('id', { count: 'exact' })
          .gte('updated_at', monthAgo.toISOString()),
        
        supabase.from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true }),
        
        supabase.from('car_parts').select('id', { count: 'exact' }),
        
        supabase.from('car_parts')
          .select('id', { count: 'exact' })
          .gte('created_at', weekAgo.toISOString()),
        
        supabase.from('car_parts')
          .select('id', { count: 'exact' })
          .gte('created_at', monthAgo.toISOString()),
        
        supabase.from('car_parts')
          .select(`
            title,
            created_at,
            profiles!supplier_id(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase.from('car_parts')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true }),
        
        supabase.from('offers').select('id', { count: 'exact' }),
        
        supabase.from('offers')
          .select('id', { count: 'exact' })
          .eq('status', 'accepted'),
        
        supabase.from('offers')
          .select('price')
          .eq('status', 'accepted'),
        
        supabase.from('offers')
          .select('created_at, price, status')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true }),
        
        supabase.from('profiles')
          .select('id', { count: 'exact' })
          .eq('user_type', 'supplier')
          .eq('is_verified', true),
        
        supabase.from('profiles')
          .select('id', { count: 'exact' })
          .eq('user_type', 'owner')
          .eq('is_verified', true),
        
        supabase.from('reviews')
          .select('rating'),
      ]);

      const processTimeSeriesData = (data: any[], dateField: string = 'created_at') => {
        const dailyData: { [key: string]: number } = {};
        
        data.forEach(item => {
          const date = new Date(item[dateField]).toISOString().split('T')[0];
          dailyData[date] = (dailyData[date] || 0) + 1;
        });
        
        return Object.entries(dailyData).map(([date, count]) => ({
          date,
          signups: count,
          listings: count,
          transactions: count,
        }));
      };

      const processTransactionData = (data: any[]) => {
        const dailyData: { [key: string]: { transactions: number; revenue: number } } = {};
        
        data.forEach(item => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          if (!dailyData[date]) {
            dailyData[date] = { transactions: 0, revenue: 0 };
          }
          dailyData[date].transactions += 1;
          if (item.status === 'accepted') {
            dailyData[date].revenue += parseFloat(item.price.toString()) || 0;
          }
        });
        
        return Object.entries(dailyData).map(([date, data]) => ({
          date,
          transactions: data.transactions,
          revenue: data.revenue,
        }));
      };

      const newSignupsData = processTimeSeriesData(newSignupsResult.data || []);
      const listingsData = processTimeSeriesData(listingsResult.data || []);
      const transactionData = processTransactionData(transactionDataResult.data || []);

      const totalRevenue = (revenueResult.data || []).reduce((sum, offer) => 
        sum + (parseFloat(offer.price.toString()) || 0), 0
      );

      const averageRating = ratingsResult.data && ratingsResult.data.length > 0
        ? ratingsResult.data.reduce((sum, review) => sum + review.rating, 0) / ratingsResult.data.length
        : 0;

      const topRecentParts = (topPartsResult.data || []).map(part => ({
        title: part.title,
        supplier: part.profiles 
          ? `${part.profiles.first_name || ''} ${part.profiles.last_name || ''}`.trim()
          : 'Unknown Seller',
        created_at: part.created_at,
      }));

      setData({
        userMetrics: {
          totalUsers: totalUsersResult.count || 0,
          activeUsersThisWeek: activeUsersWeekResult.count || 0,
          activeUsersThisMonth: activeUsersMonthResult.count || 0,
          newSignupsData,
        },
        productMetrics: {
          totalParts: totalPartsResult.count || 0,
          partsThisWeek: partsWeekResult.count || 0,
          partsThisMonth: partsMonthResult.count || 0,
          topRecentParts,
          listingsData,
        },
        transactionMetrics: {
          totalOffers: totalOffersResult.count || 0,
          successfulTransactions: successfulOffersResult.count || 0,
          totalRevenue,
          transactionData,
        },
        otherMetrics: {
          verifiedSellers: verifiedSellersResult.count || 0,
          verifiedBuyers: verifiedBuyersResult.count || 0,
          averageSellerRating: averageRating,
        },
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  return {
    data,
    loading,
    refetchData: fetchAnalyticsData
  };
};
