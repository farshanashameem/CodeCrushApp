import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: string;
  trendType?: "increase" | "decrease" | "neutral";
}

export default function SummaryCard({
  title,
  value,
  icon,
  iconBg = "from-blue-500 to-cyan-500",
  trend,
  trendType = "neutral",
}: SummaryCardProps) {
  const trendConfig = {
    increase: {
      icon: <ArrowUpRight size={16} />,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    decrease: {
      icon: <ArrowDownRight size={16} />,
      textColor: "text-red-600",
      bgColor: "bg-red-100",
    },
    neutral: {
      icon: <Minus size={16} />,
      textColor: "text-slate-600",
      bgColor: "bg-slate-100",
    },
  };

  const currentTrend = trendConfig[trendType];

  return (
    <div className="group rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${iconBg} text-white shadow-lg`}
        >
          {icon}
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${currentTrend.bgColor} ${currentTrend.textColor}`}
          >
            {currentTrend.icon}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-600">{title}</p>

        <h2 className="mt-2 text-3xl font-bold text-slate-800">
          {value}
        </h2>
      </div>
    </div>
  );
}