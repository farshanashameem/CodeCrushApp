import ChartCard from "../../components/ChartCard";
import type { GamePlayPoint } from "../../../../../../Types/reports";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface GamePlaysChartProps {
  data: GamePlayPoint[];
}

export default function GamePlaysChart({
  data,
}: GamePlaysChartProps) {
  return (
    <ChartCard
      title="Game Plays"
      subtitle="Most played games"
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
                dataKey="plays"
                fill="#8B5CF6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}