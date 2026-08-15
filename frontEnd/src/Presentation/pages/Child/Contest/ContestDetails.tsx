import { useMemo } from "react";


import {
  getCriteriaValue,
  getRankEmoji,
  getWinnerCriteriaIcon,
  getWinnerCriteriaLabel,
  formatDate,
} from "./contestUtils";

import { EmptyState, LoadingState } from "./ContestList";
import type { Contest } from "../../../../Types/ChildContest";

interface ContestDetailsProps {
  contest: Contest;
  joined: boolean;
  progress: any;
  leaderboard: any[];
  currentChildId?: string;
  currentChildRank: number | null;
  loadingProgress: boolean;
  loadingLeaderboard: boolean;
  joiningContest: boolean;
  onBack: () => void;
  onJoin: () => void;
}

const ContestDetails = ({
  contest,
  joined,
  progress,
  leaderboard,
  currentChildId,
  currentChildRank,
  loadingProgress,
  loadingLeaderboard,
  joiningContest,
  onBack,
  onJoin,
}: ContestDetailsProps) => {
  const isParticipation =
    contest.type === "PARTICIPATION";

  const isChallenge =
    contest.type === "CHALLENGE";

  const winnerCriteria =
    contest.winnerCriteria;

  const winnerCriteriaLabel =
    getWinnerCriteriaLabel(winnerCriteria);

  const winnerCriteriaIcon =
    getWinnerCriteriaIcon(winnerCriteria);

  // ============================================================
  // CONTEST STATUS
  // ============================================================

  const isCompleted =
    contest.status === "COMPLETED" ||
    new Date(contest.endDate).getTime() < Date.now();

  // ============================================================
  // CHILD'S WINNER / MEDAL
  // ============================================================

  const childWinner = useMemo(() => {
    if (!currentChildId || !contest.winners) {
      return undefined;
    }

    return contest.winners.find(
      (winner) =>
        winner.childId === currentChildId,
    );
  }, [contest.winners, currentChildId]);

  const childReward =
    childWinner?.reward;

  // ============================================================
  // TARGET PROGRESS
  // ============================================================

  const currentTargetValue = useMemo(() => {
    if (!progress) return 0;

    const criteria = String(
      winnerCriteria ?? "",
    ).toUpperCase();

    switch (criteria) {
      case "SCORE":
        return Number(
          progress.score ??
            progress.stats?.score ??
            0,
        );

      case "STARS":
        return Number(
          progress.stars ??
            progress.stats?.stars ??
            0,
        );

      case "LEVELS":
        return Number(
          progress.levelsCompleted ??
            progress.stats?.levelsCompleted ??
            0,
        );

      default:
        return 0;
    }
  }, [progress, winnerCriteria]);

  // ============================================================
  // SORT LEADERBOARD
  // ============================================================

  const sortedLeaderboard = useMemo(() => {
    if (!Array.isArray(leaderboard)) {
      return [];
    }

    const criteria = String(
      winnerCriteria ?? "SCORE",
    ).toUpperCase();

    return [...leaderboard].sort((a, b) => {
      const aValue = getCriteriaValue(
        a,
        criteria,
      );

      const bValue = getCriteriaValue(
        b,
        criteria,
      );

      return bValue - aValue;
    });
  }, [leaderboard, winnerCriteria]);

  // ============================================================
  // CURRENT / FINAL RANK
  // ============================================================

  const calculatedRank = useMemo(() => {
    if (
      !currentChildId ||
      !sortedLeaderboard.length
    ) {
      return null;
    }

    const index =
      sortedLeaderboard.findIndex(
        (player) =>
          player.childId === currentChildId,
      );

    return index === -1
      ? null
      : index + 1;
  }, [
    sortedLeaderboard,
    currentChildId,
  ]);

  // ============================================================
  // FINAL REWARD DETAILS
  // ============================================================

  const getRewardDetails = () => {
    switch (childReward) {
      case "GOLD":
        return {
          icon: "🥇",
          title: "Gold Medal!",
          description:
            "Amazing! You finished in first place!",
          titleClass:
            "text-yellow-500",
        };

      case "SILVER":
        return {
          icon: "🥈",
          title: "Silver Medal!",
          description:
            "Great job! You finished in second place!",
          titleClass:
            "text-slate-500",
        };

      case "BRONZE":
        return {
          icon: "🥉",
          title: "Bronze Medal!",
          description:
            "Well done! You finished in third place!",
          titleClass:
            "text-orange-600",
        };

      default:
        return {
          icon: "🎖️",
          title: "Participation Badge!",
          description:
            "Great job participating in the contest!",
          titleClass:
            "text-indigo-600",
        };
    }
  };

  const rewardDetails =
    getRewardDetails();

  return (
    <div className="space-y-7">

      {/* ========================================================
          BACK
      ======================================================== */}

      <button
        onClick={onBack}
        className="bg-white border-2 border-indigo-200 text-indigo-600 px-5 py-2 rounded-xl font-bold hover:bg-indigo-50"
      >
        ← Back to Contests
      </button>

      {/* ========================================================
          HERO
      ======================================================== */}

      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 md:p-12 shadow-[0_10px_0_#4338ca]">

        <div className="absolute right-5 top-5 text-8xl opacity-20">
          🏆
        </div>

        <div className="relative z-10 max-w-3xl">

          <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase">
            {contest.type} CONTEST
          </span>

          <h1 className="font-mochiy text-3xl md:text-5xl mt-4">
            {contest.title}
          </h1>

          <p className="mt-4 text-white/90 leading-relaxed">
            {contest.description}
          </p>

          {/* ====================================================
              COMPLETED STATUS
          ==================================================== */}

          {isCompleted && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border-2 border-white/20 rounded-full px-5 py-2">
              <span>
                🏁
              </span>

              <span className="font-black">
                Contest Completed
              </span>
            </div>
          )}

          {/* ====================================================
              CHALLENGE CRITERIA
          ==================================================== */}

          {isChallenge && (
            <div className="mt-6 bg-white/15 backdrop-blur-md border-2 border-white/20 rounded-2xl p-5">

              <p className="text-xs uppercase tracking-widest font-black text-white/70">
                🏆 Winner Criteria
              </p>

              <div className="flex items-center gap-3 mt-2">

                <span className="text-4xl">
                  {winnerCriteriaIcon}
                </span>

                <div>

                  <p className="text-2xl font-black">
                    {winnerCriteriaLabel}
                  </p>

                  <p className="text-sm text-white/70">
                    Highest{" "}
                    {winnerCriteriaLabel.toLowerCase()}{" "}
                    wins
                  </p>

                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              PARTICIPATION TARGET
          ==================================================== */}

          {isParticipation && (
            <div className="mt-6 bg-white text-indigo-700 rounded-2xl p-5 shadow-lg">

              <div className="flex items-center gap-3">

                <span className="text-4xl">
                  {winnerCriteriaIcon}
                </span>

                <div>

                  <p className="text-xs uppercase tracking-widest font-black text-indigo-400">
                    🎯 Contest Target
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <span className="text-2xl font-black">
                      {winnerCriteriaLabel}:{" "}
                      {contest.targetValue}
                    </span>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              DATE / GAME INFO
          ==================================================== */}

          <div className="flex flex-wrap gap-3 mt-6">

            <InfoPill>
              📅 {formatDate(contest.startDate)}
            </InfoPill>

            <InfoPill>
              🏁 {formatDate(contest.endDate)}
            </InfoPill>

            <InfoPill>
              🎮 {contest.gameIds?.length || 0} Games
            </InfoPill>

          </div>
        </div>
      </div>

      {/* ========================================================
          JOIN
          Only show if contest is active
      ======================================================== */}

      {!joined && !isCompleted && (
        <div className="bg-white border-4 border-amber-300 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_7px_0_#fcd34d]">

          <div>

            <h2 className="font-mochiy text-xl text-indigo-600">
              Ready to compete? 🚀
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Join this contest and start earning points!
            </p>

          </div>

          <button
            onClick={onJoin}
            disabled={joiningContest}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black px-8 py-4 rounded-2xl border-4 border-white shadow-[0_6px_0_#ea580c] hover:-translate-y-1 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {joiningContest
              ? "Joining..."
              : "🏆 Join Contest"}
          </button>

        </div>
      )}

      {/* ========================================================
          COMPLETED CONTEST RESULT
      ======================================================== */}

      {joined && isCompleted && (
        <div className="bg-white rounded-[2rem] border-4 border-yellow-300 p-8 text-center shadow-[0_7px_0_#fcd34d]">

          <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
            Contest Completed
          </p>

          <div className="text-7xl mt-4">
            {rewardDetails.icon}
          </div>

          <h2
            className={`text-3xl font-black mt-3 ${rewardDetails.titleClass}`}
          >
            {rewardDetails.title}
          </h2>

          <p className="text-slate-500 mt-2">
            {rewardDetails.description}
          </p>

          {/* FINAL RANK */}

          {calculatedRank && (
            <div className="mt-6 inline-flex flex-col items-center bg-indigo-50 rounded-2xl px-8 py-4">

              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                Final Rank
              </span>

              <span className="text-4xl font-black text-indigo-600 mt-1">
                #{calculatedRank}
              </span>

            </div>
          )}

          {/* REWARD */}

          {childWinner && (
            <p className="mt-4 text-sm font-bold text-slate-500">
              Reward earned:{" "}
              <span className="text-indigo-600">
                {childWinner.reward}
              </span>
            </p>
          )}

        </div>
      )}

      {/* ========================================================
          PARTICIPATION PROGRESS
          Active contest only
      ======================================================== */}

      {joined &&
        !isCompleted &&
        isParticipation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <StatCard
              icon={winnerCriteriaIcon}
              label={winnerCriteriaLabel}
              value={currentTargetValue}
            />

            <StatCard
              icon="⭐"
              label="Stars"
              value={Number(
                progress?.stars ??
                  progress?.stats?.stars ??
                  0,
              )}
            />

            <StatCard
              icon="🎮"
              label="Levels Completed"
              value={Number(
                progress?.levelsCompleted ??
                  progress?.stats?.levelsCompleted ??
                  0,
              )}
            />

          </div>
        )}

      {/* ========================================================
          CHALLENGE PROGRESS
          Active contest only
      ======================================================== */}

      {joined &&
        !isCompleted &&
        isChallenge && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <StatCard
              icon="🏆"
              label="Score"
              value={Number(
                progress?.score ?? 0,
              )}
            />

            <StatCard
              icon="⭐"
              label="Stars"
              value={Number(
                progress?.stars ?? 0,
              )}
            />

            <StatCard
              icon="🎯"
              label="Levels Completed"
              value={Number(
                progress?.levelsCompleted ?? 0,
              )}
            />

          </div>
        )}

      {/* ========================================================
          CURRENT RANK
          Active challenge only
      ======================================================== */}

      {joined &&
        !isCompleted &&
        isChallenge && (
          <div className="bg-gradient-to-r from-yellow-300 to-amber-400 rounded-[2rem] p-6 text-center border-4 border-yellow-500 shadow-[0_7px_0_#d97706]">

            <p className="text-sm font-black text-amber-900 uppercase tracking-widest">
              Your Current Position
            </p>

            <div className="text-5xl font-black text-white mt-2">
              {calculatedRank
                ? `#${calculatedRank}`
                : "—"}
            </div>

            <p className="mt-2 text-sm text-amber-900 font-bold">
              Ranking by{" "}
              {winnerCriteriaLabel}
            </p>

          </div>
        )}

      {/* ========================================================
          LEADERBOARD
      ======================================================== */}

      {joined && (
        <Leaderboard
          contest={contest}
          isChallenge={isChallenge}
          winnerCriteria={winnerCriteria}
          winnerCriteriaLabel={
            winnerCriteriaLabel
          }
          winnerCriteriaIcon={
            winnerCriteriaIcon
          }
          sortedLeaderboard={
            sortedLeaderboard
          }
          currentChildId={
            currentChildId
          }
          loadingLeaderboard={
            loadingLeaderboard
          }
        />
      )}

    </div>
  );
};

export default ContestDetails;


// ============================================================
// LEADERBOARD
// ============================================================

interface LeaderboardProps {
  contest: Contest;
  isChallenge: boolean;
  winnerCriteria?: string;
  winnerCriteriaLabel: string;
  winnerCriteriaIcon: string;
  sortedLeaderboard: any[];
  currentChildId?: string;
  loadingLeaderboard: boolean;
}

const Leaderboard = ({
  contest,
  isChallenge,
  winnerCriteria,
  winnerCriteriaLabel,
  winnerCriteriaIcon,
  sortedLeaderboard,
  currentChildId,
  loadingLeaderboard,
}: LeaderboardProps) => {

  return (
    <div className="bg-white rounded-[2rem] border-4 border-indigo-200 shadow-[0_7px_0_#c7d2fe] overflow-hidden">

      {/* HEADER */}

      <div className="p-6 border-b-4 border-dashed border-indigo-100">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h2 className="font-mochiy text-2xl text-indigo-600">
              🏆 Leaderboard
            </h2>

            <p className="text-sm text-slate-400 mt-1">

              {isChallenge
                ? `Ranked by ${winnerCriteriaLabel} — highest wins!`
                : `Track everyone's progress toward the ${contest.targetValue} ${winnerCriteriaLabel} target.`}

            </p>

          </div>

          {isChallenge && (
            <div className="flex items-center gap-2 bg-indigo-50 border-2 border-indigo-100 px-4 py-2 rounded-xl">

              <span className="text-xl">
                {winnerCriteriaIcon}
              </span>

              <span className="text-sm font-black text-indigo-600">
                Ranked by{" "}
                {winnerCriteriaLabel}
              </span>

            </div>
          )}

        </div>
      </div>

      {/* LOADING */}

      {loadingLeaderboard ? (
        <LoadingState />

      ) : !sortedLeaderboard.length ? (
        <EmptyState
          icon="🏆"
          text="No participants yet."
        />

      ) : (
        <div>

          {/* TABLE HEADER */}

          <div className="hidden md:grid md:grid-cols-[60px_1fr_120px_120px_160px] gap-4 items-center px-6 py-4 bg-indigo-50 border-b-2 border-indigo-100 text-xs font-black text-indigo-500 uppercase">

            <div className="text-center">
              Rank
            </div>

            <div>
              Player
            </div>

            <div className="text-center">
              🏆 Score
            </div>

            <div className="text-center">
              ⭐ Stars
            </div>

            <div className="text-center">
              🎯 Levels
            </div>

          </div>

          {/* PLAYERS */}

          <div className="divide-y divide-slate-100">

            {sortedLeaderboard.map(
              (player, index) => {

                const isCurrentChild =
                  player.childId ===
                  currentChildId;

                const rank =
                  index + 1;

                const score =
                  player?.score ?? 0;

                const stars =
                  player?.stars ?? 0;

                const levelsCompleted =
                  player?.levelsCompleted ?? 0;

                return (
                  <div
                    key={player.childId}
                    className={`p-4 md:px-6 md:py-5 ${
                      isCurrentChild
                        ? "bg-yellow-50 border-l-4 border-yellow-400"
                        : ""
                    }`}
                  >

                    {/* DESKTOP */}

                    <div className="hidden md:grid md:grid-cols-[60px_1fr_120px_120px_160px] gap-4 items-center">

                      <div className="text-center font-black text-xl">
                        {getRankEmoji(rank)}
                      </div>

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-xl shrink-0">
                          🧒
                        </div>

                        <div>

                          <p className="font-black text-slate-700">

                            {isCurrentChild
                              ? "You"
                              : player.childName}

                          </p>

                          {isCurrentChild && (
                            <span className="text-[10px] bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-black">
                              YOU
                            </span>
                          )}

                        </div>
                      </div>

                      <LeaderboardValue
                        icon="🏆"
                        value={score}
                        highlighted={
                          winnerCriteria ===
                          "SCORE"
                        }
                      />

                      <LeaderboardValue
                        icon="⭐"
                        value={stars}
                        highlighted={
                          winnerCriteria ===
                          "STARS"
                        }
                      />

                      <LeaderboardValue
                        icon="🎯"
                        value={
                          levelsCompleted
                        }
                        highlighted={
                          winnerCriteria ===
                          "LEVELS"
                        }
                      />

                    </div>

                    {/* MOBILE */}

                    <div className="md:hidden">

                      <div className="flex items-center gap-3">

                        <div className="w-10 text-center font-black text-lg">
                          {getRankEmoji(rank)}
                        </div>

                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-xl shrink-0">
                          🧒
                        </div>

                        <div className="flex-1">

                          <p className="font-black text-slate-700">

                            {isCurrentChild
                              ? "You"
                              : player.childName}

                          </p>

                          {isCurrentChild && (
                            <span className="text-[10px] bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-black">
                              YOU
                            </span>
                          )}

                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4">

                        <MobileLeaderboardValue
                          icon="🏆"
                          label="Score"
                          value={score}
                          highlighted={
                            winnerCriteria ===
                            "SCORE"
                          }
                        />

                        <MobileLeaderboardValue
                          icon="⭐"
                          label="Stars"
                          value={stars}
                          highlighted={
                            winnerCriteria ===
                            "STARS"
                          }
                        />

                        <MobileLeaderboardValue
                          icon="🎯"
                          label="Levels"
                          value={
                            levelsCompleted
                          }
                          highlighted={
                            winnerCriteria ===
                            "LEVELS"
                          }
                        />

                      </div>
                    </div>

                  </div>
                );
              },
            )}

          </div>
        </div>
      )}
    </div>
  );
};


// ============================================================
// LEADERBOARD VALUE
// ============================================================

interface LeaderboardValueProps {
  icon: string;
  value: number;
  highlighted?: boolean;
}

const LeaderboardValue = ({
  icon,
  value,
  highlighted = false,
}: LeaderboardValueProps) => (
  <div
    className={`text-center rounded-xl px-3 py-2 ${
      highlighted
        ? "bg-indigo-100 ring-2 ring-indigo-300"
        : ""
    }`}
  >

    <p
      className={`text-lg font-black ${
        highlighted
          ? "text-indigo-700"
          : "text-slate-700"
      }`}
    >
      {icon} {value}
    </p>

  </div>
);


// ============================================================
// MOBILE LEADERBOARD VALUE
// ============================================================

interface MobileLeaderboardValueProps {
  icon: string;
  label: string;
  value: number;
  highlighted?: boolean;
}

const MobileLeaderboardValue = ({
  icon,
  label,
  value,
  highlighted = false,
}: MobileLeaderboardValueProps) => (
  <div
    className={`text-center rounded-xl py-2 ${
      highlighted
        ? "bg-indigo-100 ring-2 ring-indigo-300"
        : "bg-slate-50"
    }`}
  >

    <p className="text-sm">
      {icon}
    </p>

    <p
      className={`font-black ${
        highlighted
          ? "text-indigo-700"
          : "text-slate-700"
      }`}
    >
      {value}
    </p>

    <p className="text-[9px] text-slate-400 uppercase font-bold">
      {label}
    </p>

  </div>
);


// ============================================================
// INFO PILL
// ============================================================

const InfoPill = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <span className="bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-bold">
    {children}
  </span>
);


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) => (
  <div className="bg-white rounded-3xl border-4 border-indigo-100 p-6 text-center shadow-[0_6px_0_#e0e7ff]">

    <div className="text-4xl">
      {icon}
    </div>

    <p className="text-xs text-slate-400 font-black uppercase mt-2">
      {label}
    </p>

    <p className="text-3xl font-black text-indigo-600 mt-1">
      {value}
    </p>

  </div>
);