import React from "react";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartsProps {
  userMetrics: {
    newSignupsData: { date: string; signups: number }[];
  };
  productMetrics: {
    listingsData: { date: string; listings: number }[];
    topRecentParts: { title: string; supplier: string; created_at: string }[];
  };
  transactionMetrics: {
    transactionData: { date: string; transactions: number; revenue: number }[];
  };
}

const chartConfig = {
  signups: {
    label: "New Signups",
    color: "hsl(var(--chart-1))",
  },
  listings: {
    label: "New Listings",
    color: "hsl(var(--chart-2))",
  },
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-3))",
  },
  revenue: {
    label: "Revenue (GHS)",
    color: "hsl(var(--chart-4))",
  },
};

const AnalyticsCharts = ({
  userMetrics,
  productMetrics,
  transactionMetrics,
}: AnalyticsChartsProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const signupsChartData = userMetrics.newSignupsData.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  const listingsChartData = productMetrics.listingsData.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  const transactionChartData = transactionMetrics.transactionData.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* First Row - Signups and Listings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-3 sm:p-4 lg:p-6 bg-card border border-border">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary">
            Daily New Signups
          </h3>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[220px] lg:h-[280px]">
            <LineChart data={signupsChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                fontSize={10}
                interval="preserveStartEnd"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={10}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="var(--color-signups)"
                strokeWidth={2}
                dot={{ fill: "var(--color-signups)", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: "var(--color-signups)" }}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-6 bg-card border border-border">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary">
            Daily New Listings
          </h3>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[220px] lg:h-[280px]">
            <BarChart data={listingsChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                fontSize={10}
                interval="preserveStartEnd"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={10}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="listings" 
                fill="var(--color-listings)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Second Row - Transactions and Recent Parts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-3 sm:p-4 lg:p-6 bg-card border border-border">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary">
            Transaction Trends
          </h3>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[220px] lg:h-[280px]">
            <BarChart data={transactionChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                fontSize={10}
                interval="preserveStartEnd"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={10}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="transactions" 
                fill="var(--color-transactions)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-6 bg-card border border-border">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary">
            Top 5 Recent Parts
          </h3>
          <div className="space-y-2 max-h-[180px] sm:max-h-[220px] lg:max-h-[280px] overflow-y-auto">
            {productMetrics.topRecentParts.length > 0 ? (
              productMetrics.topRecentParts.map((part, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-accent/50 rounded-lg border border-border">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate text-foreground">{part.title}</p>
                    <p className="text-xs text-muted-foreground truncate">by {part.supplier}</p>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {new Date(part.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[140px] sm:h-[180px] lg:h-[240px]">
                <p className="text-muted-foreground text-xs sm:text-sm">No parts listed yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
