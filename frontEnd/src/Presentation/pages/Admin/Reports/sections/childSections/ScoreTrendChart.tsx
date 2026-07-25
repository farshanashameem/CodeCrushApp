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
import type { ScoreTrendPoint } from "../../../../../../Types/reports";

interface ScoreTrendChartProps {
  data: ScoreTrendPoint[];
}

export default function ScoreTrendChart({
  data,
}: ScoreTrendChartProps) {
  return (
    <ChartCard
      title="Score Trend"
      subtitle="Average score over time"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No score trend data
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
              dataKey="averageScore"
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}