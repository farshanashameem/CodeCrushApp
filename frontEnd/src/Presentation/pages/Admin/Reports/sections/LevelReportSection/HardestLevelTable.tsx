import type { HardestLevel } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface HardestLevelsTableProps {
  data: HardestLevel[];
}

export default function HardestLevelsTable({
  data,
}: HardestLevelsTableProps) {
  return (
    <TableCard
      title="Hardest Levels"
      subtitle=" Top 10 levels requiring the most attempts"
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
                  Avg Attempts
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Success Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((level) => (
                <tr
                  key={level.levelId}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {level.levelName}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {level.difficulty}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {level.averageAttempts}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {level.successRate}%
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