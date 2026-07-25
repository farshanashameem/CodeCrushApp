import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";

import ReportHeader from "./components/ReportHeader";
import { useDispatch, useSelector } from "react-redux";
import UserReportSection from "./sections/UserReportSection/UserReportSection";
import ChildReportSection from "./sections/childSections/ChildReportSection";
import GameReportSection from "./sections/GameReportSection.tsx/GameReportSection";
import LevelReportSection from "./sections/LevelReportSection/LevelReportSection";
import RevenueReportSection from "./sections/RevenueReportSection/RevenueReportSection";

import type { ReportRange } from "../../../../Types/reports";
import { reportDateSchema } from "../../../../Lib/validation";
import { exportChildReport
  ,exportGameReport,
   exportLevelReport,
    exportRevenueReport,
     exportUserReport } from "../../../../redux/Slices/reportSlice";

import type { AppDispatch, RootState } from "../../../../redux/store";
const ReportPage = () => {
  // Values user is editing
  const [dateRange, setDateRange] = useState<ReportRange>("month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedGame, setSelectedGame] = useState("");

  // Values actually used by reports
  const [appliedRange, setAppliedRange] = useState<ReportRange>("month");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { exportLoading } = useSelector(
    (state: RootState) => state.report
  );

  const [activeTab, setActiveTab] = useState< "user" | "child" | "game" | "level" | "revenue" >("user");
  
  // Automatically apply predefined ranges
  useEffect(() => {
    if (dateRange !== "custom") {
      setAppliedRange(dateRange);
      setAppliedFromDate("");
      setAppliedToDate("");
    }
  }, [dateRange]);

  const handleApply = () => {
    const result = reportDateSchema.safeParse({
      from: fromDate,
      to: toDate,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setAppliedRange("custom");
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);

    toast.success("Report updated");
  };

  const handleExport = () => {
 const params = {
  range: appliedRange,
  from: appliedFromDate || undefined,
  to: appliedToDate || undefined,
  ...(activeTab === "level" && selectedGame
    ? { gameId: selectedGame }
    : {}),
};


  switch (activeTab) {
    case "user":
      dispatch(exportUserReport(params));
      break;

    case "child":
      dispatch(exportChildReport(params));
      break;

    case "game":
      dispatch(exportGameReport(params));
      break;

    case "level":
      dispatch(exportLevelReport(params));
      break;

    case "revenue":
      dispatch(exportRevenueReport(params));
      break;
  }
};

  return (
    <AdminDashboardLayout pageTitle="Reports">
      <div className="space-y-6">
        <ReportHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onApply={handleApply}
          onExport={handleExport}
          exportLoading={exportLoading}
        />

      

         <div className="rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 p-2 shadow-lg">
         <div className="flex flex-wrap gap-2">
            {[
               { id: "user", label: "👤 User" },
               { id: "child", label: "🧒 Child" },
               { id: "game", label: "🎮 Game" },
               { id: "level", label: "⭐ Level" },
               { id: "revenue", label: "💰 Revenue" },
            ].map((tab) => (
               <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as typeof activeTab)}
               className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                     ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                     : "bg-white/60 text-slate-700 hover:bg-white"
               }`}
               >
               {tab.label}
               </button>
            ))}
         </div>
         </div>

         {activeTab === "user" && (
         <UserReportSection
            dateRange={appliedRange}
            fromDate={appliedFromDate}
            toDate={appliedToDate}
         />
         )}

         {activeTab === "child" && (
         <ChildReportSection
            dateRange={appliedRange}
            fromDate={appliedFromDate}
            toDate={appliedToDate}
         />
         )}

         {activeTab === "game" && (
         <GameReportSection
            dateRange={appliedRange}
            fromDate={appliedFromDate}
            toDate={appliedToDate}
         />
         )}

         {activeTab === "level" && (
         <LevelReportSection
            dateRange={appliedRange}
            fromDate={appliedFromDate}
            toDate={appliedToDate}
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
         />
         )}

         {activeTab === "revenue" && (
         <RevenueReportSection
            dateRange={appliedRange}
            fromDate={appliedFromDate}
            toDate={appliedToDate}
         />
         )}
      </div>
    </AdminDashboardLayout>
  );
};

export default ReportPage;