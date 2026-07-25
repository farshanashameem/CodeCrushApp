import ChartCard from "../../components/ChartCard";
import type { CompletionRatePoint } from "../../../../../../Types/reports";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface CompletionRateChartProps {
  data: CompletionRatePoint[];
}

export default function CompletionRateChart({
  data,
}: CompletionRateChartProps) {
  return (
    <ChartCard
      title="Completion Rate"
      subtitle="Completion percentage by game"
    >
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">
          No data available
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={42} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="game"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                unit="%"
              />

              <Tooltip
                formatter={(value) => [`${value}%`, "Completion Rate"]}
              />

              <Bar
                dataKey="completionRate"
                 fill="#10B981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}