import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { GamePopularityPoint } from "../../../../../../Types/reports";

interface GamePopularityChartProps {
  data: GamePopularityPoint[];
}

export default function GamePopularityChart({
  data,
}: GamePopularityChartProps) {
  return (
    <ChartCard
      title="Game Popularity"
      subtitle="Most played games"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No game popularity data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={42} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="game" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="plays"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}