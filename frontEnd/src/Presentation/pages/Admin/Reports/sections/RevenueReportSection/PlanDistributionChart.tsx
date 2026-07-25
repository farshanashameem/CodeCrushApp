import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { PlanDistributionPoint } from "../../../../../../Types/reports";

interface PlanDistributionChartProps {
  data: PlanDistributionPoint[];
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
];

export default function PlanDistributionChart({
  data,
}: PlanDistributionChartProps) {
  return (
    <ChartCard
      title="Plan Distribution"
      subtitle="Premium plan purchase distribution"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No plan distribution data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="purchases"
              nameKey="plan"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip formatter={(value) => [`${value} Purchases`, "Purchases"]} />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}