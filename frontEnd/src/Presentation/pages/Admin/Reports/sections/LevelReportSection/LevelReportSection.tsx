import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../../../redux/store";

import { fetchLevelReport } from "../../../../../../redux/Slices/reportSlice";
import { fetchGames } from "../../../../../../redux/Slices/gameSlice";

import LevelMetrics from "./LevelMetrics";
import GameSelector from "./GameSelector";
import AttemptsChart from "./AttemptsChart";
import SuccessRateChart from "./SuccessRateChart";
import AverageScoreChart from "./AverageScoreChart";
import HardestLevelsTable from "./HardestLevelTable";
import MostCompletedLevelsTable from "./MostCompletedLevelTable";
import type { ReportRange } from "../../../../../../Types/reports";

interface LevelReportSectionProps {
  dateRange: ReportRange;
  fromDate: string;
  toDate: string;
  selectedGame: string;
  onGameChange: (id: string) => void;
}

export default function LevelReportSection({
  dateRange, fromDate, toDate, selectedGame, onGameChange
}: LevelReportSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { levelReport } = useSelector(
    (state: RootState) => state.report
  );
  const { games } = useSelector(
    (state: RootState) => state.gameManagement
  );

 useEffect(() => {
  dispatch(fetchGames());
}, [dispatch]);

useEffect(() => {
  if (games.length > 0 && !selectedGame) {
    onGameChange(games[0].id);
  }
}, [games, selectedGame, onGameChange]);

useEffect(() => {
  if (!selectedGame) return;

  dispatch(
    fetchLevelReport({
      range: dateRange,
      from: fromDate || undefined,
      to: toDate || undefined,
      gameId: selectedGame,
    })
  );
}, [dispatch, selectedGame, dateRange, fromDate, toDate]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/20 bg-white/20 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Level Performance Reports
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Analyze level difficulty, completion, attempts and scores.
            </p>
          </div>

          <GameSelector
                selectedGame={selectedGame}
                onSelectGame={onGameChange}
            />
        </div>

        <LevelMetrics metrics={levelReport?.metrics} />

        <div className="mt-6 ">
          <AttemptsChart
            data={levelReport?.attemptsChart ?? []}
          />
        </div>
        <div className="mt-6">
          <SuccessRateChart
            data={levelReport?.successRateChart ?? []}
          />
        </div>

        <div className="mt-6">
          <AverageScoreChart
            data={levelReport?.averageScoreChart ?? []}
          />
        </div>

        <div className="mt-6 space-y-6">
          <HardestLevelsTable
            data={levelReport?.hardestLevels ?? []}
          />

          <MostCompletedLevelsTable
            data={levelReport?.mostCompletedLevels ?? []}
          />
        </div>
      </div>
    </section>
  );
}