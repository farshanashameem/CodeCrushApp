import ChartCard from "../../components/ChartCard";
import type { RecentTransaction } from "../../../../../../Types/reports";
import TableCard from "../../components/TableCard";

interface RecentTransactionsTableProps {
  data: RecentTransaction[];
}

export default function RecentTransactionsTable({
  data,
}: RecentTransactionsTableProps) {
  return (
    <TableCard
      title="Recent Transactions"
      subtitle="Latest successful payments"
    >
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            No transactions available
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
                  Type
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Plan
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Amount
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Purchased
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((transaction) => (
                <tr
                  key={`${transaction.parentId}-${transaction.purchasedAt}`}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {transaction.parentName}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {transaction.type}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {transaction.plan}
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    ₹{transaction.amount}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {new Date(
                      transaction.purchasedAt
                    ).toLocaleDateString()}
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