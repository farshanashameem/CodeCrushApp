import type { ReactNode } from "react";

interface TableCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function TableCard({
  title,
  subtitle,
  children,
}: TableCardProps) {
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

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/40">
        {children}
      </div>
    </div>
  );
}