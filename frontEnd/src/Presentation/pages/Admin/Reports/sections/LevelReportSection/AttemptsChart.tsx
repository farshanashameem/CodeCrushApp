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
import type { AttemptsChartPoint } from "../../../../../../Types/reports";

interface AttemptsChartProps {
  data: AttemptsChartPoint[];
}

export default function AttemptsChart({
  data,
}: AttemptsChartProps) {
  return (
    <ChartCard
      title="Attempts"
      subtitle="Top 10 attempts by level"
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
              cursor={{ fill: "#f8fafc" }}
            />

            <Bar
              dataKey="attempts"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}