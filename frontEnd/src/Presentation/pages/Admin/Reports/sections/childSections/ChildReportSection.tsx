import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../../../redux/store";
import { fetchChildReport } from "../../../../../../redux/Slices/reportSlice";

import ChildMetrics from "./ChildMetrics";
import DailyActivityChart from "./DailyActivityChart";
import ScoreTrendChart from "./ScoreTrendChart";
import GamePopularityChart from "./GamePopularityChart";
import TopChildrenTable from "./TopChildrenTable";
import type { ReportRange } from "../../../../../../Types/reports";

interface ChildReportSectionProps {
  dateRange: ReportRange;
  fromDate: string;
  toDate: string;
}

export default function ChildReportSection({
  dateRange, fromDate, toDate
}: ChildReportSectionProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { childReport,  } = useSelector(
    (state: RootState) => state.report
  );

  useEffect(() => {
    dispatch(
      fetchChildReport({
        range: dateRange,
        from: fromDate || undefined,
        to: toDate || undefined,
      })
    );
  }, [dispatch, dateRange, fromDate, toDate]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Child Reports
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Monitor children's activity, learning progress, game performance,
            and engagement.
          </p>
        </div>

        <ChildMetrics metrics={childReport?.metrics} />
            <div className="mt-8 grid grid-cols-1 gap-6">
                <DailyActivityChart
                    data={childReport?.dailyActivity ?? []}
                />

                <ScoreTrendChart
                    data={childReport?.scoreTrend ?? []}
                />

                <GamePopularityChart
                    data={childReport?.gamePopularity ?? []}
                />

                <TopChildrenTable
                    data={childReport?.topChildren ?? []}
                />
            </div>
      </div>
    </section>
  );
}