import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import contestBackground from "../../../assets/level-backgrounds/contest-bg.png";
import contestLogo from "../../../assets/contest-logo.png";
import type { AppDispatch, RootState } from "../../../redux/store";

import {
  getAvailableContests,
  getJoinedContests,
  joinContest,
  getContestProgress,
  getContestLeaderboard,
  clearContestProgress,
  clearContestError,
} from "../../../redux/Slices/childContestSlice";

import { getCurrentChildSession } from "../../../redux/Slices/childGameSlice";

import ChildLayout from "../../SharedComponents/Child/ChildLayout";

type ContestTab = "active" | "mine" | "ranking";

const ChildContestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    availableContests,
    joinedContests,
    selectedContestProgress,
    leaderboard,

    loadingAvailable,
    loadingJoined,
    loadingProgress,
    loadingLeaderboard,

    joiningContest,
    error,
  } = useSelector((state: RootState) => state.childContest);

  const { currentChild } = useSelector((state: RootState) => state.childGame);

  const [activeTab, setActiveTab] = useState<ContestTab>("active");

  const [selectedContestId, setSelectedContestId] = useState<string | null>(
    null,
  );

  /* ===================================================================== */
  /* INITIAL DATA */
  /* ===================================================================== */

  // Restore child session after refresh
  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  // Fetch contest data after currentChild is restored
  useEffect(() => {
    if (!currentChild?.id) return;

    dispatch(getAvailableContests(currentChild.id));
    dispatch(getJoinedContests(currentChild.id));

    return () => {
      dispatch(clearContestProgress());
      dispatch(clearContestError());
    };
  }, [currentChild?.id, dispatch]);

  

  /* ===================================================================== */
  /* SELECTED CONTEST */
  /* ===================================================================== */

  const selectedAvailableContest = useMemo(
    () =>
      availableContests?.find((contest) => contest.id === selectedContestId),
    [availableContests, selectedContestId],
  );

  const selectedJoinedContest = useMemo(
    () =>
      joinedContests?.find(
        (contest) => contest.contestId === selectedContestId,
      ),
    [joinedContests, selectedContestId],
  );

  const selectedContest = selectedAvailableContest || selectedJoinedContest;

  /* ===================================================================== */
  /* HELPERS */
  /* ===================================================================== */

const normalizeCriteria = (criteria?: string): string => {
  return String(criteria ?? "SCORE").toUpperCase();
};

const getWinnerCriteriaLabel = (criteria?: string): string => {
  switch (normalizeCriteria(criteria)) {
    case "SCORE":
      return "Score";

    case "STARS":
      return "Stars";

    case "LEVELS":
      return "Levels";

    default:
      return "Score";
  }
};

const getWinnerCriteriaIcon = (criteria?: string): string => {
  switch (normalizeCriteria(criteria)) {
    case "SCORE":
      return "🏆";

    case "STARS":
      return "⭐";

    case "LEVELS":
      return "🎯";

    default:
      return "🏆";
  }
};

/**
 * Get the actual numeric value used for
 * leaderboard sorting and displaying.
 */
const getCriteriaValue = (
  player: any,
  criteria?: string,
): number => {
  const normalizedCriteria = normalizeCriteria(criteria);

  switch (normalizedCriteria) {
    case "SCORE":
      return Number(
        player?.score ??
        player?.stats?.score ??
        0,
      );

    case "STARS":
      return Number(
        player?.stars ??
        player?.stats?.stars ??
        0,
      );

    case "LEVELS":
      return Number(
        player?.levelsCompleted ??
        player?.stats?.levelsCompleted ??
        0,
      );

    default:
      return 0;
  }
};

  /* ===================================================================== */
  /* OPEN CONTEST */
  /* ===================================================================== */

  const handleContestClick = (contestId: string) => {
    setSelectedContestId(contestId);

    dispatch(clearContestProgress());

    const joinedContest = joinedContests.find(
      (contest) => contest.contestId === contestId,
    );

    if (joinedContest && currentChild?.id) {
      dispatch(
        getContestProgress({
          contestId,
          childId: currentChild.id,
        }),
      );

      dispatch(getContestLeaderboard(contestId));
    }
  };

  /* ===================================================================== */
  /* CLOSE CONTEST DETAILS */
  /* ===================================================================== */

  const handleCloseDetails = () => {
    setSelectedContestId(null);
    dispatch(clearContestProgress());
  };

  /* ===================================================================== */
  /* JOIN CONTEST */
  /* ===================================================================== */

  const handleJoinContest = async (contestId: string) => {
    if (!currentChild?.id) return;

    try {
      await dispatch(
        joinContest({
          contestId,
          childId: currentChild.id,
        }),
      ).unwrap();

      await Promise.all([
        dispatch(getAvailableContests(currentChild.id)),
        dispatch(getJoinedContests(currentChild.id)),
      ]);

      dispatch(
        getContestProgress({
          contestId,
          childId: currentChild.id,
        }),
      );

      dispatch(getContestLeaderboard(contestId));
    } catch {
      // Error is already handled by Redux state.
    }
  };

  /* ===================================================================== */
  /* RENDER */
  /* ===================================================================== */

  return (
    <ChildLayout
      background={contestBackground}
      child={currentChild}
      coins={0}
      logo={contestLogo}
      title="🏆Contests"
      isPremium={currentChild?.isPremium}
    >
      <div
        className="
          min-h-screen
          w-full
          relative
          bg-cover
          bg-center
          bg-no-repeat
          bg-fixed
          px-4
          py-8
          md:px-8
        "
      >
        {/* BACKGROUND OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-white/20
            pointer-events-none
          "
        />

        {/* PAGE CONTENT */}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* HEADER */}

          <div className="text-center mb-8">
            <p
              className="
                mt-4
                text-slate-700
                font-bold
              "
            >
              Compete • Play • Earn • Become a Champion!
            </p>
          </div>

          {/* TABS */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-3
              mb-8
            "
          >
            <ContestTabButton
              active={activeTab === "active"}
              onClick={() => {
                setActiveTab("active");
                handleCloseDetails();
              }}
              icon="🔥"
              label="Active Contests"
            />

            <ContestTabButton
              active={activeTab === "mine"}
              onClick={() => {
                setActiveTab("mine");
                handleCloseDetails();
              }}
              icon="🎮"
              label="My Contests"
            />

            <ContestTabButton
              active={activeTab === "ranking"}
              onClick={() => {
                setActiveTab("ranking");
                handleCloseDetails();
              }}
              icon="📊"
              label="My Ranking"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                bg-red-50
                border-2
                border-red-200
                text-red-600
                rounded-2xl
                px-5
                py-3
                text-center
                font-bold
              "
            >
              {error}
            </div>
          )}

          {/* ACTIVE CONTESTS */}

          {activeTab === "active" && !selectedContestId && (
            <ContestList
              contests={availableContests}
              loading={loadingAvailable}
              emptyIcon="🎯"
              emptyText="No active contests available right now."
              onContestClick={handleContestClick}
            />
          )}

          {/* MY CONTESTS */}

          {activeTab === "mine" && !selectedContestId && (
            <JoinedContestList
              contests={joinedContests}
              loading={loadingJoined}
              onContestClick={handleContestClick}
            />
          )}

          {/* MY RANKING */}

          {activeTab === "ranking" && (
            <RankingView
              contests={joinedContests}
              currentChildId={currentChild?.id}
              onContestClick={(contestId) => {
                setActiveTab("mine");
                handleContestClick(contestId);
              }}
            />
          )}

          {/* CONTEST DETAILS */}

          {selectedContestId && selectedContest && (
            <ContestDetails
              contest={selectedContest}
              joined={!!selectedJoinedContest}
              progress={selectedContestProgress}
              leaderboard={leaderboard}
              currentChildId={currentChild?.id}
              loadingProgress={loadingProgress}
              loadingLeaderboard={loadingLeaderboard}
              joiningContest={joiningContest}
              onBack={handleCloseDetails}
              onJoin={() => handleJoinContest(selectedContestId)}
            />
          )}
        </div>
      </div>
    </ChildLayout>
  );
};

export default ChildContestsPage;

/* ===================================================================== */
/* TAB BUTTON */
/* ===================================================================== */

interface ContestTabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const ContestTabButton = ({
  active,
  onClick,
  icon,
  label,
}: ContestTabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-5
        py-3
        rounded-2xl
        border-4
        font-bold
        transition-all
        flex
        items-center
        gap-2

        ${
          active
            ? `
              bg-indigo-600
              text-white
              border-indigo-700
              shadow-[0_5px_0_#4338ca]
              -translate-y-1
            `
            : `
              bg-white
              text-indigo-600
              border-indigo-200
              shadow-[0_5px_0_#c7d2fe]
              hover:-translate-y-1
            `
        }
      `}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
};

/* ===================================================================== */
/* ACTIVE CONTEST LIST */
/* ===================================================================== */

interface ContestListProps {
  contests: any[];
  loading: boolean;
  emptyIcon: string;
  emptyText: string;
  onContestClick: (id: string) => void;
}

const ContestList = ({
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
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-7
      "
    >
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

/* ===================================================================== */
/* JOINED CONTEST LIST */
/* ===================================================================== */

interface JoinedContestListProps {
  contests: any[];
  loading: boolean;
  onContestClick: (id: string) => void;
}

const JoinedContestList = ({
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
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-7
      "
    >
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

/* ===================================================================== */
/* CONTEST CARD */
/* ===================================================================== */

interface ContestCardProps {
  contest: any;
  joined: boolean;
  onClick: () => void;
}

const ContestCard = ({ contest, joined, onClick }: ContestCardProps) => {
  return (
    <button
      onClick={onClick}
      className="
        text-left
        bg-white
        rounded-[2rem]
        overflow-hidden
        border-4
        border-indigo-200
        shadow-[0_9px_0_#c7d2fe]
        hover:-translate-y-2
        hover:shadow-[0_14px_0_#a5b4fc]
        transition-all
        duration-300
        group
      "
    >
      {/* Contest Banner */}

      <div
        className="
          relative
          h-44
          bg-gradient-to-br
          from-indigo-500
          via-purple-500
          to-pink-500
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -top-10
            -right-10
            text-8xl
            opacity-20
          "
        >
          🏆
        </div>

        <div
          className="
            absolute
            -bottom-8
            -left-8
            text-7xl
            opacity-20
          "
        >
          ⭐
        </div>

        <div
          className="
            relative
            z-10
            p-6
            text-white
          "
        >
          <div
            className="
              text-xs
              font-black
              uppercase
              tracking-widest
              opacity-80
            "
          >
            {contest.type}
          </div>

          <h2
            className="
              font-mochiy
              text-2xl
              mt-2
            "
          >
            {contest.title}
          </h2>

          {joined && (
            <span
              className="
                inline-block
                mt-3
                bg-white/20
                backdrop-blur-sm
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
              "
            >
              🎮 JOINED
            </span>
          )}
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        <p
          className="
            text-slate-500
            text-sm
            line-clamp-2
            min-h-[40px]
          "
        >
          {contest.description}
        </p>

        <div
          className="
            flex
            flex-wrap
            gap-2
            mt-4
          "
        >
          {contest.gameIds?.map((gameId: string) => (
            <span
              key={gameId}
              className="
                  bg-indigo-50
                  text-indigo-600
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-bold
                "
            >
              🎮 Game
            </span>
          ))}
        </div>

        <div
          className="
            flex
            justify-between
            items-center
            mt-5
            pt-4
            border-t
            border-dashed
            border-slate-200
          "
        >
          <span
            className="
              text-xs
              text-slate-400
              font-bold
            "
          >
            📅 Ends {formatDate(contest.endDate)}
          </span>

          <span
            className="
              text-indigo-600
              font-black
              text-sm
              group-hover:translate-x-1
              transition-transform
            "
          >
            View →
          </span>
        </div>
      </div>
    </button>
  );
};

/* ===================================================================== */
/* CONTEST DETAILS */
/* ===================================================================== */

interface ContestDetailsProps {
  contest: any;
  joined: boolean;
  progress: any;
  leaderboard: any[];
  currentChildId?: string;
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
  loadingProgress,
  loadingLeaderboard,
  joiningContest,
  onBack,
  onJoin,
}: ContestDetailsProps) => {
  /* ============================================================= */
  /* CONTEST TYPE */
  /* ============================================================= */

  const isParticipation = contest.type === "PARTICIPATION";

  const isChallenge = contest.type === "CHALLENGE";
           

  /* ============================================================= */
  /* WINNER CRITERIA */
  /* ============================================================= */

  const winnerCriteria = contest.winnerCriteria;

  const winnerCriteriaLabel = getWinnerCriteriaLabel(winnerCriteria);

  const winnerCriteriaIcon = getWinnerCriteriaIcon(winnerCriteria);

  /* ============================================================= */
  /* TARGET PROGRESS */
  /* ============================================================= */

  const currentTargetValue = useMemo(() => {
  if (!progress) return 0;

  const criteria = String(winnerCriteria ?? "").toUpperCase();

  switch (criteria) {
    case "SCORE":
      return Number(
        progress.score ??
        progress.stats?.score ??
        0
      );

    case "STARS":
      return Number(
        progress.stars ??
        progress.stats?.stars ??
        0
      );

    case "LEVELS":
      return Number(
        progress.levelsCompleted ??
        progress.stats?.levelsCompleted ??
        0
      );

    default:
      return 0;
  }
}, [progress, winnerCriteria]);
  /* ============================================================= */
  /* SORT LEADERBOARD */
  /* ============================================================= */

const sortedLeaderboard = useMemo(() => {
  if (!Array.isArray(leaderboard)) {
    return [];
  }

  const criteria = String(winnerCriteria ?? "SCORE").toUpperCase();

  const sorted = [...leaderboard].sort((a, b) => {
    const aValue = getCriteriaValue(a, criteria);
    const bValue = getCriteriaValue(b, criteria);

 

    return bValue - aValue;
  });



  return sorted;
}, [leaderboard, winnerCriteria]);

  /* ============================================================= */
  /* CURRENT CHILD POSITION */
  /* ============================================================= */

  const calculatedRank = useMemo(() => {
    if (!currentChildId || !sortedLeaderboard.length) {
      return null;
    }

    const index = sortedLeaderboard.findIndex(
      (player) => player.childId === currentChildId,
    );

    return index === -1 ? null : index + 1;
  }, [sortedLeaderboard, currentChildId]);

  /* ============================================================= */
  /* RENDER */
  /* ============================================================= */

  return (
    <div className="space-y-7">
      {/* BACK */}

      <button
        onClick={onBack}
        className="
          bg-white
          border-2
          border-indigo-200
          text-indigo-600
          px-5
          py-2
          rounded-xl
          font-bold
          hover:bg-indigo-50
        "
      >
        ← Back to Contests
      </button>

      {/* HERO */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[2.5rem]
          bg-gradient-to-br
          from-indigo-600
          via-purple-600
          to-pink-500
          text-white
          p-8
          md:p-12
          shadow-[0_10px_0_#4338ca]
        "
      >
        <div
          className="
            absolute
            right-5
            top-5
            text-8xl
            opacity-20
          "
        >
          🏆
        </div>

        <div
          className="
            relative
            z-10
            max-w-4xl
          "
        >
          <span
            className="
              inline-block
              bg-white/20
              px-4
              py-1
              rounded-full
              text-xs
              font-black
              uppercase
            "
          >
            {contest.type} CONTEST
          </span>

          <h1
            className="
              font-mochiy
              text-3xl
              md:text-5xl
              mt-4
            "
          >
            {contest.title}
          </h1>

          <p
            className="
              mt-4
              text-white/90
              leading-relaxed
            "
          >
            {contest.description}
          </p>

          {/* CHALLENGE WINNER CRITERIA */}

          {isChallenge && (
            <div
              className="
                mt-6
                bg-white/15
                backdrop-blur-md
                border-2
                border-white/20
                rounded-2xl
                p-5
              "
            >
              <p
                className="
                  text-xs
                  uppercase
                  tracking-widest
                  font-black
                  text-white/70
                "
              >
                🏆 Winner Criteria
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mt-2
                "
              >
                <span className="text-4xl">{winnerCriteriaIcon}</span>

                <div>
                  <p
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    {winnerCriteriaLabel}
                  </p>

                  <p
                    className="
                      text-sm
                      text-white/70
                    "
                  >
                    Highest {winnerCriteriaLabel.toLowerCase()} wins
                  </p>
                </div>
              </div>
            </div>
          )}

          

          {/* PARTICIPATION TARGET */}

            {isParticipation && (
              <div
                className="
                  mt-6
                  bg-white
                  text-indigo-700
                  rounded-2xl
                  p-5
                  shadow-lg
                "
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {winnerCriteriaIcon}
                  </span>

                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-widest
                        font-black
                        text-indigo-400
                      "
                    >
                      🎯 Contest Target
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black">
                        {winnerCriteriaLabel}: {contest.targetValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* DATE / GAME INFO */}

          <div
            className="
              flex
              flex-wrap
              gap-3
              mt-6
            "
          >
            <InfoPill>📅 {formatDate(contest.startDate)}</InfoPill>

            <InfoPill>🏁 {formatDate(contest.endDate)}</InfoPill>

            <InfoPill>🎮 {contest.gameIds?.length || 0} Games</InfoPill>
          </div>
        </div>
      </div>

      {/* JOIN */}

      {!joined && (
        <div
          className="
            bg-white
            border-4
            border-amber-300
            rounded-[2rem]
            p-6
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
            shadow-[0_7px_0_#fcd34d]
          "
        >
          <div>
            <h2
              className="
                font-mochiy
                text-xl
                text-indigo-600
              "
            >
              Ready to compete? 🚀
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Join this contest and start earning points!
            </p>
          </div>

          <button
            onClick={onJoin}
            disabled={joiningContest}
            className="
              bg-gradient-to-r
              from-orange-400
              to-pink-500
              text-white
              font-black
              px-8
              py-4
              rounded-2xl
              border-4
              border-white
              shadow-[0_6px_0_#ea580c]
              hover:-translate-y-1
              active:translate-y-1
              transition-all
              disabled:opacity-50
            "
          >
            {joiningContest ? "Joining..." : "🏆 Join Contest"}
          </button>
        </div>
      )}

      {/* PARTICIPATION PROGRESS */}

        {joined && isParticipation && (
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
                0
              )}
            />

            <StatCard
              icon="🎮"
              label="Levels Completed"
              value={Number(
                progress?.levelsCompleted ??
                progress?.stats?.levelsCompleted ??
                0
              )}
            />
          </div>
        )}

      {/* CHALLENGE PROGRESS */}

      {joined && isChallenge && (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          "
        >
          <StatCard icon="🏆" label="Score" value={progress?.score ?? 0} />

          <StatCard icon="⭐" label="Stars" value={progress?.stars ?? 0} />

          <StatCard
            icon="🎯"
            label="Levels Completed"
            value={progress?.levelsCompleted ?? 0}
          />
        </div>
      )}

      {/* CURRENT RANK */}

      {joined && isChallenge && (
        <div
          className="
            bg-gradient-to-r
            from-yellow-300
            to-amber-400
            rounded-[2rem]
            p-6
            text-center
            border-4
            border-yellow-500
            shadow-[0_7px_0_#d97706]
          "
        >
          <p
            className="
              text-sm
              font-black
              text-amber-900
              uppercase
              tracking-widest
            "
          >
            Your Current Position
          </p>

          <div
            className="
              text-5xl
              font-black
              text-white
              mt-2
            "
          >
            {calculatedRank ? `#${calculatedRank}` : "—"}
          </div>

          <p
            className="
              mt-2
              text-sm
              text-amber-900
              font-bold
            "
          >
            Ranking by {winnerCriteriaLabel}
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEADERBOARD */}
      {/* ========================================================= */}

      {joined && (
        <div
          className="
            bg-white
            rounded-[2rem]
            border-4
            border-indigo-200
            shadow-[0_7px_0_#c7d2fe]
            overflow-hidden
          "
        >
          {/* LEADERBOARD HEADER */}

          <div
            className="
              p-6
              border-b-4
              border-dashed
              border-indigo-100
            "
          >
            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-3
              "
            >
              <div>
                <h2
                  className="
                    font-mochiy
                    text-2xl
                    text-indigo-600
                  "
                >
                  🏆 Leaderboard
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-400
                    mt-1
                  "
                >
                  {isChallenge
                    ? `Ranked by ${winnerCriteriaLabel} — highest wins!`
                    : `Track everyone's progress toward the ${contest.targetValue} ${winnerCriteriaLabel} target.`}
                </p>
              </div>

              {isChallenge && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    bg-indigo-50
                    border-2
                    border-indigo-100
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  <span className="text-xl">{winnerCriteriaIcon}</span>

                  <span
                    className="
                      text-sm
                      font-black
                      text-indigo-600
                    "
                  >
                    Ranked by {winnerCriteriaLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* LOADING */}

          {loadingLeaderboard ? (
            <LoadingState />
          ) : !sortedLeaderboard.length ? (
            <EmptyState icon="🏆" text="No participants yet." />
          ) : (
            <div>
              {/* TABLE HEADER */}

              <div
                className="
                  hidden
                  md:grid
                  md:grid-cols-[60px_1fr_120px_120px_160px]
                  gap-4
                  items-center
                  px-6
                  py-4
                  bg-indigo-50
                  border-b-2
                  border-indigo-100
                  text-xs
                  font-black
                  text-indigo-500
                  uppercase
                "
              >
                <div className="text-center">Rank</div>

                <div>Player</div>

                <div className="text-center">🏆 Score</div>

                <div className="text-center">⭐ Stars</div>

                <div className="text-center">🎯 Levels</div>
              </div>

              {/* PLAYERS */}

              <div className="divide-y divide-slate-100">
                {sortedLeaderboard.map((player, index) => {
                  const isCurrentChild = player.childId === currentChildId;

                  const rank = index + 1;

                  const score = player?.score ?? 0;

                  const stars = player?.stars ?? 0;

                  const levelsCompleted = player?.levelsCompleted ?? 0;

                  return (
                    <div
                      key={player.childId}
                      className={`
                          p-4
                          md:px-6
                          md:py-5

                          ${
                            isCurrentChild
                              ? "bg-yellow-50 border-l-4 border-yellow-400"
                              : ""
                          }
                        `}
                    >
                      {/* DESKTOP */}

                      <div
                        className="
                            hidden
                            md:grid
                            md:grid-cols-[60px_1fr_120px_120px_160px]
                            gap-4
                            items-center
                          "
                      >
                        {/* RANK */}

                        <div
                          className="
                              text-center
                              font-black
                              text-xl
                            "
                        >
                          {getRankEmoji(rank)}
                        </div>

                        {/* PLAYER */}

                        <div className="flex items-center gap-3">
                          <div
                            className="
                                w-11
                                h-11
                                rounded-full
                                bg-indigo-100
                                flex
                                items-center
                                justify-center
                                text-xl
                                shrink-0
                              "
                          >
                            🧒
                          </div>

                          <div>
                            <p
                              className="
                                  font-black
                                  text-slate-700
                                "
                            >
                              {isCurrentChild ? "You" : player.childName}
                            </p>

                            {isCurrentChild && (
                              <span
                                className="
                                    text-[10px]
                                    bg-yellow-200
                                    text-yellow-700
                                    px-2
                                    py-0.5
                                    rounded-full
                                    font-black
                                  "
                              >
                                YOU
                              </span>
                            )}
                          </div>
                        </div>

                        {/* SCORE */}

                        <LeaderboardValue
                          icon="🏆"
                          value={score}
                          highlighted={winnerCriteria === "SCORE"}
                        />

                        {/* STARS */}

                        <LeaderboardValue
                          icon="⭐"
                          value={stars}
                          highlighted={winnerCriteria === "STARS"}
                        />

                        {/* LEVELS */}

                        <LeaderboardValue
                          icon="🎯"
                          value={levelsCompleted}
                          highlighted={winnerCriteria === "LEVELS"}
                        />
                      </div>

                      {/* MOBILE */}

                      <div className="md:hidden">
                        <div
                          className="
                              flex
                              items-center
                              gap-3
                            "
                        >
                          {/* RANK */}

                          <div
                            className="
                                w-10
                                text-center
                                font-black
                                text-lg
                              "
                          >
                            {getRankEmoji(rank)}
                          </div>

                          {/* AVATAR */}

                          <div
                            className="
                                w-11
                                h-11
                                rounded-full
                                bg-indigo-100
                                flex
                                items-center
                                justify-center
                                text-xl
                                shrink-0
                              "
                          >
                            🧒
                          </div>

                          {/* PLAYER */}

                          <div className="flex-1">
                            <p
                              className="
                                  font-black
                                  text-slate-700
                                "
                            >
                              {isCurrentChild ? "You" : player.childName}
                            </p>

                            {isCurrentChild && (
                              <span
                                className="
                                    text-[10px]
                                    bg-yellow-200
                                    text-yellow-700
                                    px-2
                                    py-0.5
                                    rounded-full
                                    font-black
                                  "
                              >
                                YOU
                              </span>
                            )}
                          </div>
                        </div>

                        {/* MOBILE STATS */}

                        <div
                          className="
                              grid
                              grid-cols-3
                              gap-2
                              mt-4
                            "
                        >
                          <MobileLeaderboardValue
                            icon="🏆"
                            label="Score"
                            value={score}
                            highlighted={winnerCriteria === "SCORE"}
                          />

                          <MobileLeaderboardValue
                            icon="⭐"
                            label="Stars"
                            value={stars}
                            highlighted={winnerCriteria === "STARS"}
                          />

                          <MobileLeaderboardValue
                            icon="🎯"
                            label="Levels"
                            value={levelsCompleted}
                            highlighted={winnerCriteria === "LEVELS"}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===================================================================== */
/* LEADERBOARD VALUE */
/* ===================================================================== */

interface LeaderboardValueProps {
  icon: string;
  value: number;
  highlighted?: boolean;
}

const LeaderboardValue = ({
  icon,
  value,
  highlighted = false,
}: LeaderboardValueProps) => {
  return (
    <div
      className={`
        text-center
        rounded-xl
        px-3
        py-2

        ${highlighted ? "bg-indigo-100 ring-2 ring-indigo-300" : ""}
      `}
    >
      <p
        className={`
          text-lg
          font-black
          ${highlighted ? "text-indigo-700" : "text-slate-700"}
        `}
      >
        {icon} {value}
      </p>
    </div>
  );
};

/* ===================================================================== */
/* MOBILE LEADERBOARD VALUE */
/* ===================================================================== */

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
}: MobileLeaderboardValueProps) => {
  return (
    <div
      className={`
        text-center
        rounded-xl
        py-2

        ${highlighted ? "bg-indigo-100 ring-2 ring-indigo-300" : "bg-slate-50"}
      `}
    >
      <p className="text-sm">{icon}</p>

      <p
        className={`
          font-black
          ${highlighted ? "text-indigo-700" : "text-slate-700"}
        `}
      >
        {value}
      </p>

      <p
        className="
          text-[9px]
          text-slate-400
          uppercase
          font-bold
        "
      >
        {label}
      </p>
    </div>
  );
};

/* ===================================================================== */
/* RANKING VIEW */
/* ===================================================================== */

interface RankingViewProps {
  contests: any[];
  currentChildId?: string;
  onContestClick: (id: string) => void;
}

const RankingView = ({ contests, onContestClick }: RankingViewProps) => {
  if (!contests.length) {
    return (
      <EmptyState
        icon="📊"
        text="Join a contest to start tracking your rankings!"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div
        className="
          bg-white
          border-4
          border-indigo-200
          rounded-[2rem]
          p-6
          shadow-[0_7px_0_#c7d2fe]
        "
      >
        <h2
          className="
            font-mochiy
            text-2xl
            text-indigo-600
          "
        >
          📊 My Contest Journey
        </h2>

        <p
          className="
            text-slate-500
            mt-2
          "
        >
          Track all the contests you've joined and check your progress.
        </p>
      </div>

      {contests.map((contest) => (
        <button
          key={contest.contestId}
          onClick={() => onContestClick(contest.contestId)}
          className="
            w-full
            text-left
            bg-white
            border-4
            border-indigo-100
            rounded-3xl
            p-5
            hover:border-indigo-300
            hover:-translate-y-1
            transition-all
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-5
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-indigo-100
                flex
                items-center
                justify-center
                text-3xl
              "
            >
              🏆
            </div>

            <div className="flex-1">
              <h3
                className="
                  font-mochiy
                  text-lg
                  text-indigo-600
                "
              >
                {contest.title}
              </h3>

              <p
                className="
                  text-sm
                  text-slate-400
                  mt-1
                "
              >
                {contest.completed ? "🎉 Contest Completed" : "🔥 In Progress"}
              </p>
            </div>

            <div className="flex gap-5">
              <MiniStat label="Score" value={contest.score ?? 0} />

              <MiniStat label="Stars" value={contest.stars ?? 0} />

              <MiniStat label="Levels" value={contest.levelsCompleted ?? 0} />
            </div>

            <span
              className="
                text-indigo-500
                font-black
              "
            >
              →
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

/* ===================================================================== */
/* SMALL COMPONENTS */
/* ===================================================================== */

const InfoPill = ({ children }: { children: React.ReactNode }) => (
  <span
    className="
      bg-white/15
      backdrop-blur-sm
      border
      border-white/20
      px-4
      py-2
      rounded-full
      text-xs
      font-bold
    "
  >
    {children}
  </span>
);

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) => (
  <div
    className="
      bg-white
      rounded-3xl
      border-4
      border-indigo-100
      p-6
      text-center
      shadow-[0_6px_0_#e0e7ff]
    "
  >
    <div className="text-4xl">{icon}</div>

    <p
      className="
        text-xs
        text-slate-400
        font-black
        uppercase
        mt-2
      "
    >
      {label}
    </p>

    <p
      className="
        text-3xl
        font-black
        text-indigo-600
        mt-1
      "
    >
      {value}
    </p>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <p
      className="
        text-xs
        text-slate-400
      "
    >
      {label}
    </p>

    <p
      className="
        font-black
        text-indigo-600
      "
    >
      {value}
    </p>
  </div>
);

const LoadingState = () => (
  <div className="py-20 text-center">
    <div
      className="
        text-5xl
        animate-bounce
      "
    >
      🏆
    </div>

    <p
      className="
        mt-4
        text-slate-500
        font-bold
      "
    >
      Loading contests...
    </p>
  </div>
);

const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
  <div
    className="
      bg-white
      rounded-[2rem]
      border-4
      border-dashed
      border-indigo-200
      py-20
      text-center
    "
  >
    <div className="text-6xl">{icon}</div>

    <p
      className="
        mt-5
        text-slate-500
        font-bold
      "
    >
      {text}
    </p>
  </div>
);

/* ===================================================================== */
/* HELPERS */
/* ===================================================================== */

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";

  return `#${rank}`;
};

/* ===================================================================== */
/* WINNER CRITERIA HELPERS */
/* ===================================================================== */

const getWinnerCriteriaLabel = (criteria?: string): string => {
  switch (criteria) {
    case "SCORE":
      return "Score";

    case "STARS":
      return "Stars";

    case "LEVELS":
      return "Levels";

    default:
      return "Score";
  }
};

const getWinnerCriteriaIcon = (criteria?: string): string => {
  switch (criteria) {
    case "SCORE":
      return "🏆";

    case "STARS":
      return "⭐";

    case "LEVELS":
      return "🎯";

    default:
      return "🏆";
  }
};

const getCriteriaValue = (player: any, criteria?: string): number => {
  switch (criteria) {
    case "SCORE":
      return player?.score ?? 0;

    case "STARS":
      return player?.stars ?? 0;

    case "LEVELS":
      return player?.levelsCompleted ?? 0;

    default:
      return 0;
  }
};
