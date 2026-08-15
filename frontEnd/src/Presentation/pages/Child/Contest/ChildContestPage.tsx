import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import contestBackground from "../../../../assets/level-backgrounds/contest-bg.png";
import contestLogo from "../../../../assets/contest-logo.png";

import type { AppDispatch, RootState } from "../../../../redux/store";

import {
  getAvailableContests,
  getJoinedContests,
  joinContest,
  getContestProgress,
  getContestLeaderboard,
  clearContestProgress,
  clearContestError,
} from "../../../../redux/Slices/childContestSlice";

import { getCurrentChildSession } from "../../../../redux/Slices/childGameSlice";

import ChildLayout from "../../../SharedComponents/Child/ChildLayout";

import ContestTabs from "./ContestTabs";

import ContestDetails from "./ContestDetails";
import { ContestList, JoinedContestList } from "./ContestList";
import RankingView from "./RankingView";


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

  const { currentChild } = useSelector(
    (state: RootState) => state.childGame,
  );

  const [activeTab, setActiveTab] =
    useState<ContestTab>("active");

  const [selectedContestId, setSelectedContestId] =
    useState<string | null>(null);

  // ============================================================
  // INITIAL DATA
  // ============================================================

  // Restore child session after refresh
  useEffect(() => {
    dispatch(getCurrentChildSession());
  }, [dispatch]);

  // Fetch contests after current child is restored
  useEffect(() => {
    if (!currentChild?.id) return;

    dispatch(getAvailableContests(currentChild.id));
    dispatch(getJoinedContests(currentChild.id));

    return () => {
      dispatch(clearContestProgress());
      dispatch(clearContestError());
    };
  }, [currentChild?.id, dispatch]);

  // ============================================================
  // SELECTED CONTEST
  // ============================================================

  const selectedAvailableContest = useMemo(
    () =>
      availableContests?.find(
        (contest) => contest.id === selectedContestId,
      ),
    [availableContests, selectedContestId],
  );

  const selectedJoinedContest = useMemo(
    () =>
      joinedContests?.find(
        (contest) => contest.contestId === selectedContestId,
      ),
    [joinedContests, selectedContestId],
  );

  const selectedContest =
    selectedAvailableContest || selectedJoinedContest;

  // ============================================================
  // OPEN CONTEST
  // ============================================================

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

  // ============================================================
  // CLOSE CONTEST DETAILS
  // ============================================================

  const handleCloseDetails = () => {
    setSelectedContestId(null);
    dispatch(clearContestProgress());
  };

  // ============================================================
  // JOIN CONTEST
  // ============================================================

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

  // ============================================================
  // CURRENT CHILD RANK
  // ============================================================

  const currentChildRank = useMemo(() => {
    if (!currentChild?.id) return null;

    const item = leaderboard?.find(
      (item) => item.childId === currentChild.id,
    );

    return item?.rank ?? null;
  }, [leaderboard, currentChild?.id]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <ChildLayout
      background={contestBackground}
      child={currentChild}
      coins={0}
      logo={contestLogo}
      title="🏆Contests"
      isPremium={currentChild?.isPremium}
    >
      <div className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed px-4 py-8 md:px-8">
        {/* BACKGROUND OVERLAY */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        {/* PAGE CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-8">
            <p className="mt-4 text-slate-700 font-bold">
              Compete • Play • Earn • Become a Champion!
            </p>
          </div>

          {/* TABS */}
          <ContestTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              handleCloseDetails();
            }}
          />

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl px-5 py-3 text-center font-bold">
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
              currentChildRank={currentChildRank}
              loadingProgress={loadingProgress}
              loadingLeaderboard={loadingLeaderboard}
              joiningContest={joiningContest}
              onBack={handleCloseDetails}
              onJoin={() =>
                handleJoinContest(selectedContestId)
              }
            />
          )}
        </div>
      </div>
    </ChildLayout>
  );
};

export default ChildContestsPage;