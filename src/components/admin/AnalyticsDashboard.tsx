import React, { useState } from "react";
import AnalyticsStats from "./AnalyticsStats";
import DateRangeFilter from "./DateRangeFilter";
import AnalyticsCharts from "./AnalyticsCharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const { data, loading } = useAnalyticsData(dateRange);

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateRangeFilter
        onDateRangeChange={handleDateRangeChange}
        currentRange={dateRange}
      />

      <AnalyticsStats
        userMetrics={data.userMetrics}
        productMetrics={data.productMetrics}
        transactionMetrics={data.transactionMetrics}
        otherMetrics={data.otherMetrics}
      />

      <AnalyticsCharts
        userMetrics={data.userMetrics}
        productMetrics={data.productMetrics}
        transactionMetrics={data.transactionMetrics}
      />
    </div>
  );
};

export default AnalyticsDashboard;
