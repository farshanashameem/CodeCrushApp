import type { Contest } from "../../../../Types/ContestManagement";

interface ContestCardProps {
  contest: Contest;
  isJoined: boolean;
  onSelect: () => void;
  onJoin: () => void;
}

const ContestCard = ({
  contest,
  isJoined,
  onSelect,
  onJoin,
}: ContestCardProps) => {
  const isCompleted = contest.status === "COMPLETED";

  return (
    <div
      className="cursor-pointer rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{contest.title}</h3>

          <p className="mt-1 text-sm text-gray-500">{contest.description}</p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
          {contest.type}
        </span>
      </div>

      {/* Dates */}
      <div className="mb-4 flex justify-between text-sm text-gray-500">
        <span>{formatDate(contest.startDate)}</span>

        <span>{formatDate(contest.endDate)}</span>
      </div>

      {/* Target */}
      {contest.targetValue !== undefined && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Target</p>

          <p className="font-bold">{contest.targetValue}</p>
        </div>
      )}

      {/* Status */}
      <div className="mb-3">
        {isCompleted ? (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            Contest Completed
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
            In Progress
          </span>
        )}
      </div>

      {/* Action */}
      {isCompleted ? (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200"
        >
          View Results
        </button>
      ) : isJoined ? (
        <button
          disabled
          className="w-full rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700"
        >
          Joined
        </button>
      ) : (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onJoin();
          }}
          className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
        >
          Join Contest
        </button>
      )}
    </div>
  );
};

const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default ContestCard;
