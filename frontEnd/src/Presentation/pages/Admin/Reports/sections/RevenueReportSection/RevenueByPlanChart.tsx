import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { RevenueByPlanPoint } from "../../../../../../Types/reports";

interface RevenueByPlanChartProps {
  data: RevenueByPlanPoint[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
];

export default function RevenueByPlanChart({
  data,
}: RevenueByPlanChartProps) {
  return (
    <ChartCard
      title="Revenue by Plan"
      subtitle="Revenue generated from each premium plan"
    >
      {data.length === 0 ? (
        <p className="flex h-full items-center justify-center text-sm text-slate-500">
          No revenue data
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
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

            <Tooltip formatter={(value) => `₹${value}`} />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}