import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { RevenueTrendPoint } from "../../../../../../Types/reports";

interface RevenueTrendChartProps {
  data: RevenueTrendPoint[];
}

export default function RevenueTrendChart({
  data,
}: RevenueTrendChartProps) {
  return (
    <ChartCard
      title="Revenue Trend"
      subtitle="Revenue over the selected period"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No revenue data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}