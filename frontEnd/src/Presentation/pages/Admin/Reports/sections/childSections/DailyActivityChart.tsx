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
import type { ChildActivityPoint } from "../../../../../../Types/reports";

interface DailyActivityChartProps {
  data: ChildActivityPoint[];
}

export default function DailyActivityChart({
  data,
}: DailyActivityChartProps) {
  return (
    <ChartCard
      title="Daily Activity"
      subtitle="Active children over time"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No activity data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="activeChildren"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}