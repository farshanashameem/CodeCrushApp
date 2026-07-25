import { Download, CalendarDays, Loader2 } from "lucide-react";

import type { ReportRange } from "../../../../../Types/reports";

interface ReportHeaderProps {
  dateRange: ReportRange;
  onDateRangeChange: (value: ReportRange) => void;

  fromDate: string;
  toDate: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onApply: () => void;

  onExport: () => void;
  exportLoading: boolean;
}

export default function ReportHeader({
  dateRange,
  onDateRangeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
  onExport,
  exportLoading,
}: ReportHeaderProps) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-xl p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <CalendarDays size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Reports
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                View platform analytics, user activity, game performance and business insights.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <select
              value={dateRange}
              onChange={(e) =>
                onDateRangeChange(e.target.value as ReportRange)
              }
              className="rounded-xl border border-white/30 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            <button
              onClick={onExport}
              disabled={exportLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {exportLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export Excel
                </>
              )}
            </button>

          </div>

          {dateRange === "custom" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row">

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    From
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => onFromDateChange(e.target.value)}
                    className="rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    To
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => onToDateChange(e.target.value)}
                    className="rounded-xl border border-white/30 bg-white/70 px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

              </div>

              <div className="flex justify-end">
                <button
                  onClick={onApply}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Apply
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}