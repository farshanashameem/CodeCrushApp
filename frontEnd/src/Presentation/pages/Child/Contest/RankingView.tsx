interface RankingViewProps {
  contests: any[];
  currentChildId?: string;
  onContestClick: (id: string) => void;
}

const RankingView = ({
  contests,
  onContestClick,
}: RankingViewProps) => {


  if (!contests.length) {
    return (
      <div className="bg-white rounded-[2rem] border-4 border-dashed border-indigo-200 py-20 text-center">
        <div className="text-6xl">
          📊
        </div>

        <p className="mt-5 text-slate-500 font-bold">
          Join a contest to start tracking your rankings!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="bg-white border-4 border-indigo-200 rounded-[2rem] p-6 shadow-[0_7px_0_#c7d2fe]">

        <h2 className="font-mochiy text-2xl text-indigo-600">
          📊 My Contest Journey
        </h2>

        <p className="text-slate-500 mt-2">
          Track all the contests you've joined and check your progress.
        </p>
      </div>

      {/* CONTESTS */}
        {contests.map((contest) => {
        const isCompleted =
            contest.completed ||
            new Date(contest.endDate).getTime() < Date.now();

        return (
            <button
            key={contest.contestId}
            onClick={() => onContestClick(contest.contestId)}
            className="w-full text-left bg-white border-4 border-indigo-100 rounded-3xl p-5 hover:border-indigo-300 hover:-translate-y-1 transition-all"
            >
            <div className="flex flex-col md:flex-row md:items-center gap-5">

                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">
                🏆
                </div>

                <div className="flex-1">

                <h3 className="font-mochiy text-lg text-indigo-600">
                    {contest.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                    {isCompleted
                    ? "🎉 Contest Completed"
                    : "🔥 In Progress"}
                </p>

                </div>

                <div className="flex gap-5">

                <MiniStat
                    label="Score"
                    value={contest.score ?? 0}
                />

                <MiniStat
                    label="Stars"
                    value={contest.stars ?? 0}
                />

                <MiniStat
                    label="Levels"
                    value={contest.levelsCompleted ?? 0}
                />

                </div>

                <span className="text-indigo-500 font-black">
                →
                </span>

            </div>
            </button>
        );
        })}
    </div>
  );
};

const MiniStat = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="text-center">
    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="font-black text-indigo-600">
      {value}
    </p>
  </div>
);

export default RankingView;