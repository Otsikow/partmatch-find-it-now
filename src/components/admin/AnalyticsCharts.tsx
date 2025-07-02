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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-gradient-to-br from-white/90 to-blue-50/30">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          Daily New Signups
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={signupsChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="signups"
              stroke="var(--color-signups)"
              strokeWidth={2}
              dot={{ fill: "var(--color-signups)" }}
            />
          </LineChart>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-white/90 to-purple-50/30">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          Daily New Listings
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={listingsChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="listings" fill="var(--color-listings)" />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-white/90 to-green-50/30">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          Transaction Trends
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={transactionChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="transactions" fill="var(--color-transactions)" />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-white/90 to-yellow-50/30">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          Top 5 Recent Parts
        </h3>
        <div className="space-y-3">
          {productMetrics.topRecentParts.length > 0 ? (
            productMetrics.topRecentParts.map((part, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{part.title}</p>
                  <p className="text-xs text-gray-600">by {part.supplier}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(part.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No parts listed yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
