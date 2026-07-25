import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  children,
}: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-lg p-5 shadow-lg">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-800">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/30">
        {children}
      </div>
    </div>
  );
}