import ChartCard from "../../components/ChartCard";
import type { TopPayingParent } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface TopPayingParentsTableProps {
  data: TopPayingParent[];
}

export default function TopPayingParentsTable({
  data,
}: TopPayingParentsTableProps) {
  return (
    <TableCard
      title="Top Paying Parents"
      subtitle="Parents with the highest spending"
    >
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            No data available
          </p>
        </div>
      ) : (
        <div className="h-full w-full overflow-auto">
          <table className="min-w-full text-sm whitespace-nowrap">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Parent
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Purchases
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Total Spent
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((parent) => (
                <tr
                  key={parent.parentId}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {parent.parentName}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {parent.purchases}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                    ₹{parent.totalSpent}
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