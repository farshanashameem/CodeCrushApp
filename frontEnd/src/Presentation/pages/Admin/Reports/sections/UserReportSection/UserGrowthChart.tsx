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
import type { UserGrowthPoint } from "../../../../../../Types/reports";

interface UserGrowthChartProps {
  data: UserGrowthPoint[];
}

export default function UserGrowthChart({
  data,
}: UserGrowthChartProps) {
  return (
    <ChartCard
      title="User Growth"
      subtitle="Parent registrations over time"
    >
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">
          No data available
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
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}