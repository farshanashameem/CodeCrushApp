import ChartCard from "../../components/ChartCard";
import type { TopPerformingGame } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface TopGamesTableProps {
  data: TopPerformingGame[];
}

export default function TopGamesTable({
  data,
}: TopGamesTableProps) {
  return (
    <TableCard
      title="Top Performing Games"
      subtitle="Games ranked by total plays"
    >
      <div className="h-full w-full overflow-auto rounded-xl bg-white/30">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr className="text-left text-slate-700">
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3 text-right">Plays</th>
              <th className="px-4 py-3 text-right">Avg Score</th>
              <th className="px-4 py-3 text-right">Completion</th>
              <th className="px-4 py-3 text-right">Avg Attempts</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-slate-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((game) => (
                <tr
                  key={game.gameId}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">

                      <span className="font-medium">
                        {game.gameName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {game.totalPlays}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {game.averageScore}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {game.completionRate}%
                  </td>

                  <td className="px-4 py-3 text-right">
                    {game.averageAttempts.toFixed(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TableCard>
  );
}