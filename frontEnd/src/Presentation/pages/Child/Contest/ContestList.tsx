import type {
  Contest
} from "../../../../Types/ContestManagement";
import { formatDate } from "./contestUtils";
import type { AvailableContest } from "../../../../Types/ChildContest";
interface JoinedContest {
  contestId: string;
  title: string;
  description: string;
  type: string;
  gameIds?: string[];
  startDate: string;
  endDate: string;
  completed?: boolean;
  score?: number;
  stars?: number;
  levelsCompleted?: number;
}

interface ContestListProps {
  contests: AvailableContest[];
  loading: boolean;
  emptyIcon: string;
  emptyText: string;
  onContestClick: (id: string) => void;
}

interface JoinedContestListProps {
  contests: JoinedContest[];
  loading: boolean;
  onContestClick: (id: string) => void;
}

interface ContestCardProps {
  contest: Contest | AvailableContest | JoinedContest;
  joined: boolean;
  onClick: () => void;
}

export const ContestList = ({
  contests,
  loading,
  emptyIcon,
  emptyText,
  onContestClick,
}: ContestListProps) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!contests.length) {
    return <EmptyState icon={emptyIcon} text={emptyText} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          joined={false}
          onClick={() => onContestClick(contest.id)}
        />
      ))}
    </div>
  );
};

export const JoinedContestList = ({
  contests,
  loading,
  onContestClick,
}: JoinedContestListProps) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!contests.length) {
    return <EmptyState icon="🎮" text="You haven't joined any contests yet!" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
      {contests.map((contest) => (
        <ContestCard
          key={contest.contestId}
          contest={contest}
          joined
          onClick={() => onContestClick(contest.contestId)}
        />
      ))}
    </div>
  );
};

const ContestCard = ({
  contest,
  joined,
  onClick,
}: ContestCardProps) => {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-[2rem] overflow-hidden border-4 border-indigo-200 shadow-[0_9px_0_#c7d2fe] hover:-translate-y-2 hover:shadow-[0_14px_0_#a5b4fc] transition-all duration-300 group"
    >
      {/* BANNER */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        <div className="absolute -top-10 -right-10 text-8xl opacity-20">
          🏆
        </div>

        <div className="absolute -bottom-8 -left-8 text-7xl opacity-20">
          ⭐
        </div>

        <div className="relative z-10 p-6 text-white">
          <div className="text-xs font-black uppercase tracking-widest opacity-80">
            {contest.type}
          </div>

          <h2 className="font-mochiy text-2xl mt-2">
            {contest.title}
          </h2>

          {joined && (
            <span className="inline-block mt-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
              🎮 JOINED
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px]">
          {contest.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {contest.gameIds?.map((gameId) => (
            <span
              key={gameId}
              className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold"
            >
              🎮 Game
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-slate-200">
          <span className="text-xs text-slate-400 font-bold">
            📅 Ends {formatDate(contest.endDate)}
          </span>

          <span className="text-indigo-600 font-black text-sm group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </button>
  );
};

export const LoadingState = () => (
  <div className="py-20 text-center">
    <div className="text-5xl animate-bounce">🏆</div>

    <p className="mt-4 text-slate-500 font-bold">
      Loading contests...
    </p>
  </div>
);

export const EmptyState = ({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) => (
  <div className="bg-white rounded-[2rem] border-4 border-dashed border-indigo-200 py-20 text-center">
    <div className="text-6xl">{icon}</div>

    <p className="mt-5 text-slate-500 font-bold">
      {text}
    </p>
  </div>
);