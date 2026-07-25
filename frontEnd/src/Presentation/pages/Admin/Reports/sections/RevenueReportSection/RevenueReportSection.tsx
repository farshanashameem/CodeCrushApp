import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../../../redux/store";

import { fetchRevenueReport } from "../../../../../../redux/Slices/reportSlice";

import RevenueMetrics from "./RevenueMetrics";
import RevenueTrendChart from "./RevenueTrendChart";
import RevenueByPlanChart from "./RevenueByPlanChart";
import PlanDistributionChart from "./PlanDistributionChart";
import RecentTransactionsTable from "./RecentTransactionsTable";
import TopPayingParentsTable from "./TopPayingParentsTable";
import type { ReportRange } from "../../../../../../Types/reports";

interface RevenueReportSectionProps {
  dateRange: ReportRange;
  fromDate: string;
  toDate: string;
}

export default function RevenueReportSection({
  dateRange, fromDate, toDate
}: RevenueReportSectionProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { revenueReport } = useSelector(
    (state: RootState) => state.report
  );

  useEffect(() => {
    dispatch(
      fetchRevenueReport({
        range: dateRange,
        from: fromDate || undefined,
        to: toDate || undefined,
      })
    );
  }, [dispatch, dateRange, fromDate, toDate]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/20 bg-white/20 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Revenue Reports
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Monitor revenue, subscriptions and payment activity.
          </p>
        </div>

        <RevenueMetrics
          metrics={revenueReport?.metrics}
        />

        {/* Revenue Trend */}
        <div className="mt-6">
          <RevenueTrendChart
            data={revenueReport?.revenueTrend ?? []}
          />
        </div>

        {/* Revenue by Plan & Plan Distribution */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueByPlanChart
            data={revenueReport?.revenueByPlan ?? []}
          />

          <PlanDistributionChart
            data={revenueReport?.planDistribution ?? []}
          />
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <RecentTransactionsTable
            data={revenueReport?.recentTransactions ?? []}
          />
        </div>

        {/* Top Paying Parents */}
        <div className="mt-6">
          <TopPayingParentsTable
            data={revenueReport?.topPayingParents ?? []}
          />
        </div>
      </div>
    </section>
  );
}