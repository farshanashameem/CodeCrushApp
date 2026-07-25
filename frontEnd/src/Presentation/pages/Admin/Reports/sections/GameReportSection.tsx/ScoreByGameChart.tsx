import ChartCard from "../../components/ChartCard";
import type { ScoreByGamePoint } from "../../../../../../Types/reports";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ScoreByGameChartProps {
  data: ScoreByGamePoint[];
}

export default function ScoreByGameChart({
  data,
}: ScoreByGameChartProps) {
  return (
    <ChartCard
      title="Average Score by Game"
      subtitle="Average score achieved in each game"
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

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="averageScore"
                fill="#06B6D4"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}