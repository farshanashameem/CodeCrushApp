import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import ChartCard from "../../components/ChartCard";
import type { SubscriptionDistribution } from "../../../../../../Types/reports";

interface PremiumFreeChartProps {
  data?: SubscriptionDistribution;
}

const COLORS = ["#f59e0b", "#64748b"];

export default function PremiumFreeChart({
  data,
}: PremiumFreeChartProps) {
  const chartData = [
    {
      name: "Premium",
      value: data?.premium ?? 0,
    },
    {
      name: "Free",
      value: data?.free ?? 0,
    },
  ];

  return (
    <ChartCard
      title="Premium vs Free"
      subtitle="Subscription distribution"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}