import ChartCard from "../../components/ChartCard";
import type { MostCompletedLevel } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface MostCompletedLevelsTableProps {
  data: MostCompletedLevel[];
}

export default function MostCompletedLevelsTable({
  data,
}: MostCompletedLevelsTableProps) {
  return (
    <TableCard
      title="Most Completed Levels"
      subtitle="Top 10 levels with the highest completion count"
    >
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center">
          <p className="text-sm text-slate-500">
            No data available
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Level
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Difficulty
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Completed
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Completion Rate
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Avg Score
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((level) => (
                <tr
                  key={level.levelId}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {level.levelName}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {level.difficulty}
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    {level.completedPlayers}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {level.completionRate}%
                  </td>

                  <td className="px-4 py-3 text-center">
                    {Math.round(level.averageScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TableCard>
  );
}