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
import type { AverageScoreChartPoint } from "../../../../../../Types/reports";

interface AverageScoreChartProps {
  data: AverageScoreChartPoint[];
}

export default function AverageScoreChart({
  data,
}: AverageScoreChartProps) {
  return (
    <ChartCard
      title="Average Score"
      subtitle="Top 10 average score by game or level"
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
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [Math.round(Number(value)), "Average Score"]}
              cursor={{ fill: "#f8fafc" }}
            />

            <Bar
              dataKey="averageScore"
              fill="#F59E0B"
              radius={[6, 6, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}