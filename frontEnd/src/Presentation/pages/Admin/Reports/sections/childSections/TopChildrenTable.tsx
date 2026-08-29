import type { TopPerformingChild } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface TopChildrenTableProps {
  data: TopPerformingChild[];
}

export default function TopChildrenTable({
  data,
}: TopChildrenTableProps) {
  return (
    <TableCard
      title="Top Performing Children"
      subtitle="Top 10 children based on total score"
    >
      <div className="h-full w-full overflow-auto rounded-xl bg-white/30">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr className="text-left text-slate-700">
              <th className="px-4 py-3">Child</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Completed</th>
              <th className="px-4 py-3 text-right">Play Time</th>
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
              data.map((child) => (
                <tr
                  key={child.childId}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      

                      <span className="font-medium">
                        {child.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {child.parentName}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {child.totalScore}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {child.completedLevels}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {Math.round(child.totalPlayTime / 60)} min
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