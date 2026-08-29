import UserMetrics from "./UserMetrics";
import UserGrowthChart from "./UserGrowthChart";
import PremiumFreeChart from "./PremiumFreeChart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../../../redux/store";
import { fetchUserReport } from "../../../../../../redux/Slices/reportSlice";
import type { ReportRange } from "../../../../../../Types/reports";
interface UserReportSectionProps {
  dateRange: ReportRange;
  fromDate: string;
  toDate: string;
}

export default function UserReportSection({
  dateRange, fromDate, toDate

}: UserReportSectionProps) {

  const dispatch = useDispatch<AppDispatch>();

const { userReport,} = useSelector(
  (state: RootState) => state.report
);

useEffect(() => {
  dispatch(
    fetchUserReport({
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
            User Reports
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Monitor parent registrations, active users and subscription statistics.
          </p>
        </div>

        <UserMetrics metrics={userReport?.metrics} />

        <div className="mt-8 grid grid-cols-1 gap-6">
          <UserGrowthChart data={userReport?.userGrowth ?? []} />
          <PremiumFreeChart data={userReport?.subscriptionDistribution} />
        </div>
      </div>
    </section>
  );
}