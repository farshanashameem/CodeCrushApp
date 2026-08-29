
import { useEffect } from "react";
import { Download,  } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import TableCard from "../../components/TableCard";

import type { AppDispatch, RootState } from "../../../../../../redux/store";
import {
  fetchAIGamePopularityReport,
  exportAIGamePopularityReport,
} from "../../../../../../redux/Slices/reportSlice";

export default function AIGamePopularityTable() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    aiGamePopularityReport,
    exportLoading,
  } = useSelector(
    (state: RootState) => state.report
  );

  useEffect(() => {
    dispatch(fetchAIGamePopularityReport());
  }, [dispatch]);

  const handleDownload = () => {
    dispatch(exportAIGamePopularityReport());
  };

  return (
    <TableCard
      title="AI Game Popularity"
      subtitle="AI-generated games created by children"
    >
      <div className="space-y-4">

        {/* Header / Download */}
        <div className="flex items-center justify-between p-3 ">
          

          <button
            type="button"
            onClick={handleDownload}
            disabled={exportLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
            <Download size={16} />

            {exportLoading
              ? "Downloading..."
              : "Download Excel"}
          </button>
        </div>

        {/* Table */}
        <div className="h-full w-full overflow-auto rounded-xl bg-white/30">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr className="text-left text-slate-700">
                <th className="px-4 py-3">
                  Game Type
                </th>

                <th className="px-4 py-3">
                  Difficulty
                </th>

                <th className="px-4 py-3 text-right">
                  Creation Count
                </th>
              </tr>
            </thead>

            <tbody>
              {!aiGamePopularityReport ||
              aiGamePopularityReport.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-slate-500"
                  >
                    No AI game creation data available
                  </td>
                </tr>
              ) : (
                aiGamePopularityReport.map((item, index) => (
                  <tr
                    key={`${item.gameType}-${item.difficulty}-${index}`}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {item.gameType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        {item.difficulty}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {item.creationCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </TableCard>
  );
}
