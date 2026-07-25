import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { SuccessRateChartPoint } from "../../../../../../Types/reports";

interface SuccessRateChartProps {
  data: SuccessRateChartPoint[];
}

export default function SuccessRateChart({
  data,
}: SuccessRateChartProps) {
  return (
    <ChartCard
      title="Success Rate"
      subtitle=" Top 10 success rate by  level"
    >
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            No data available
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
            barCategoryGap="35%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Success Rate"]}
              cursor={{ fill: "#f8fafc" }}
            />

            <Bar
              dataKey="successRate"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}