import type { ReactNode } from "react";

interface ReportMetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
}

export default function ReportMetricCard({
  title,
  value,
  icon,
  iconBg = "from-blue-500 to-cyan-500",
}: ReportMetricCardProps) {
  return (
    <div className="group rounded-2xl border border-white/20 bg-white/15 backdrop-blur-lg p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}