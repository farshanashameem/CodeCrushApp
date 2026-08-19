import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../../../redux/store";
import { fetchGameReport } from "../../../../../../redux/Slices/reportSlice";

import GameMetrics from "./GameMetrics";
import GamePlaysChart from "./GamePlaysChart";
import CompletionRateChart from "./CompletionRateChart";
import ScoreByGameChart from "./ScoreByGameChart";
import TopGamesTable from "./TopGamesTable";
import type { ReportRange } from "../../../../../../Types/reports";
import AIGamePopularityTable from "./AIGamePopularityTable";

interface GameReportSectionProps {
  dateRange: ReportRange;
  fromDate: string;
  toDate: string;
}

export default function GameReportSection({
  dateRange, fromDate, toDate
}: GameReportSectionProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { gameReport } = useSelector(
    (state: RootState) => state.report
  );

  useEffect(() => {
    dispatch(
      fetchGameReport({
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
            Game Reports
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Monitor game usage, completion, scores and performance.
          </p>
        </div>

        <GameMetrics
          metrics={gameReport?.metrics}
        />

        <div className="mt-6 space-y-6">

          <GamePlaysChart
            data={gameReport?.gamePlays ?? []}
          />

          <CompletionRateChart
            data={gameReport?.completionRate ?? []}
          />

          <ScoreByGameChart
            data={gameReport?.scoreByGame ?? []}
          />

          <TopGamesTable
            data={gameReport?.topGames ?? []}
          />

          <AIGamePopularityTable/>

        </div>
      </div>
    </section>
  );
}