import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../redux/store";
import type { Contest } from "../../../Types/ContestManagement";

import AdminDashboardLayout from "../../layouts/AdminDashboardLayout";

import {
  fetchContests,
  getContestDetail,
} from "../../../redux/Slices/contestManagementSlice";

import CreateContestModal from "../../SharedComponents/CreateContestModal";

const Contests = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ============================================================
  // LOCAL STATE
  // ============================================================

  // Controls Create / Update modal
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  // Contest currently being edited
  // null = create mode
  const [contestToEdit, setContestToEdit] =
    useState<Contest | null>(null);

  // Which contest card is expanded
  const [expandedContestId, setExpandedContestId] =
    useState<string | null>(null);

  // ============================================================
  // REDUX STATE
  // ============================================================

  const {
    contests,
    selectedContest,
    loading,
    detailsLoading,
    error,
  } = useSelector(
    (state: RootState) => state.contestManagement
  );

  // ============================================================
  // FETCH ALL CONTESTS
  // ============================================================

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  // ============================================================
  // DEBUG
  // ============================================================

  console.log("Contests:", contests);
  console.log("Selected Contest:", selectedContest);

  // ============================================================
  // DATE FORMATTER
  // ============================================================

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "UPCOMING":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "COMPLETED":
        return "bg-slate-100 text-slate-600 border-slate-200";

      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ============================================================
  // CONTEST TYPE STYLE
  // ============================================================

  const getContestTypeStyle = (type: string) => {
    switch (type) {
      case "CHALLENGE":
        return "bg-indigo-50 text-indigo-700";

      case "PARTICIPATION":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  // ============================================================
  // ADD CONTEST
  // ============================================================

  const handleAddContest = () => {
    // null means CREATE mode
    setContestToEdit(null);

    setIsCreateModalOpen(true);
  };

  // ============================================================
  // UPDATE CONTEST
  // ============================================================

  const handleUpdateContest = (contest: Contest) => {
    // Existing contest means UPDATE mode
    setContestToEdit(contest);

    setIsCreateModalOpen(true);
  };

  // ============================================================
  // VIEW / HIDE DETAILS
  // ============================================================

  const handleToggleDetails = async (
    contestId: string
  ) => {
    // If this card is already expanded,
    // clicking again will hide the details.
    if (expandedContestId === contestId) {
      setExpandedContestId(null);
      return;
    }

    // Expand this card
    setExpandedContestId(contestId);

    // Fetch complete contest details
    await dispatch(
      getContestDetail({
        id: contestId,
      })
    );
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleModalClose = () => {
    setIsCreateModalOpen(false);

    setContestToEdit(null);
  };

  // ============================================================
  // AFTER CREATE / UPDATE
  // ============================================================

  const handleContestSaved = () => {
    setIsCreateModalOpen(false);

    setContestToEdit(null);

    // Refresh contest list
    dispatch(fetchContests());
  };

  // ============================================================
  // RETRY FETCH
  // ============================================================

  const handleRetry = () => {
    dispatch(fetchContests());
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <AdminDashboardLayout pageTitle="CONTEST MANAGEMENT 🏆">

        <div className="space-y-6 w-full text-slate-700">

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

              {/* TITLE */}

              <div>
                <h2 className="text-lg font-black tracking-wide text-slate-800 uppercase">
                  Contest Management
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Create and manage competitive events for children
                </p>
              </div>

              {/* ADD CONTEST */}

              <button
                type="button"
                onClick={handleAddContest}
                className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                + Add Contest
              </button>

            </div>

          </div>

          {/* ================================================== */}
          {/* CONTEST LIST */}
          {/* ================================================== */}

          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl">

            {/* ================================================= */}
            {/* LIST HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
                  Available Contests
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Manage currently configured contests
                </p>
              </div>

              {!loading && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {contests.length} Contest
                  {contests.length !== 1 ? "s" : ""}
                </span>
              )}

            </div>

            {/* ================================================= */}
            {/* LOADING */}
            {/* ================================================= */}

            {loading && (
              <div className="py-16 flex flex-col items-center justify-center gap-2">

                <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

                <span className="text-xs font-medium text-slate-400">
                  Loading contests...
                </span>

              </div>
            )}

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {!loading && error && (
              <div className="py-12 text-center">

                <div className="text-3xl mb-2">
                  ⚠️
                </div>

                <p className="text-sm font-semibold text-rose-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* ================================================= */}
            {/* EMPTY */}
            {/* ================================================= */}

            {!loading &&
              !error &&
              contests.length === 0 && (
                <div className="py-16 text-center">

                  <div className="text-5xl mb-3">
                    🏆
                  </div>

                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">
                    No Contests Found
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    No contests have been created yet.
                    Click{" "}
                    <strong>+ Add Contest</strong>{" "}
                    above to create your first contest.
                  </p>

                </div>
              )}

            {/* ================================================= */}
            {/* CONTEST CARDS */}
            {/* ================================================= */}

            {!loading &&
              !error &&
              contests.length > 0 && (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {contests.map((contest) => {

                    const isExpanded =
                      expandedContestId === contest.id;

                    const isSelected =
                      selectedContest?.id === contest.id;

                    return (

                      <div
                        key={contest.id}
                        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                      >

                        {/* ====================================== */}
                        {/* CARD BODY */}
                        {/* ====================================== */}

                        <div className="p-5">

                          {/* ==================================== */}
                          {/* TITLE + STATUS */}
                          {/* ==================================== */}

                          <div className="flex justify-between items-start gap-3">

                            <div className="min-w-0">

                              <h3 className="text-lg font-black text-slate-800 truncate">
                                {contest.title}
                              </h3>

                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {contest.description}
                              </p>

                            </div>

                            <span
                              className={`shrink-0 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusStyle(
                                contest.status
                              )}`}
                            >
                              {contest.status}
                            </span>

                          </div>

                          {/* ==================================== */}
                          {/* TYPE + GAMES */}
                          {/* ==================================== */}

                          <div className="flex flex-wrap gap-2 mt-4">

                            <span
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getContestTypeStyle(
                                contest.type
                              )}`}
                            >
                              {contest.type.replace(
                                /_/g,
                                " "
                              )}
                            </span>

                            {contest.gameIds &&
                            contest.gameIds.length > 0 ? (

                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                                🎮{" "}
                                {contest.gameIds.length}{" "}
                                Game
                                {contest.gameIds.length !== 1
                                  ? "s"
                                  : ""}
                              </span>

                            ) : (

                              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-wider">
                                🌐 All Games
                              </span>

                            )}

                          </div>

                          {/* ==================================== */}
                          {/* WINNER CRITERIA */}
                          {/* ==================================== */}

                          <div className="mt-4 flex flex-wrap gap-2">

                            {contest.winnerCriteria && (
                              <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[9px] font-black uppercase tracking-wider">
                                🏆{" "}
                                {contest.winnerCriteria}
                              </span>
                            )}

                            {contest.targetValue !==
                              undefined &&
                              contest.targetValue !==
                                null && (

                                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-[9px] font-black uppercase tracking-wider">
                                  🎯 Target:{" "}
                                  {contest.targetValue}
                                </span>

                              )}

                          </div>

                          {/* ==================================== */}
                          {/* DATES */}
                          {/* ==================================== */}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">

                              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                Starts
                              </p>

                              <p className="text-xs font-bold text-slate-700 mt-1">
                                {formatDate(contest.startDate)}
                              </p>

                            </div>

                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">

                              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                Ends
                              </p>

                              <p className="text-xs font-bold text-slate-700 mt-1">
                                {formatDate(contest.endDate)}
                              </p>

                            </div>

                          </div>

                          {/* ==================================== */}
                          {/* VIEW DETAILS */}
                          {/* ==================================== */}

                          <div className="mt-5 pt-4 border-t border-slate-100">

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleDetails(
                                  contest.id
                                )
                              }
                              className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {isExpanded
                                ? "▲ Hide Details"
                                : "▼ View Details"}
                            </button>

                          </div>

                          {/* ==================================== */}
                          {/* EXPANDED DETAILS */}
                          {/* ==================================== */}

                          {isExpanded && (

                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                              {/* DETAIL LOADING */}

                              {detailsLoading && (
                                <div className="py-8 flex flex-col items-center justify-center gap-2">

                                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

                                  <p className="text-xs text-slate-400">
                                    Loading contest details...
                                  </p>

                                </div>
                              )}

                              {/* DETAILS */}

                              {!detailsLoading &&
                                selectedContest &&
                                isSelected && (

                                  <div className="space-y-5">

                                    {/* DESCRIPTION */}

                                    <div>

                                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                        Description
                                      </p>

                                      <p className="text-xs text-slate-700 mt-1">
                                        {
                                          selectedContest.description
                                        }
                                      </p>

                                    </div>

                                    {/* TYPE + STATUS */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          Contest Type
                                        </p>

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          {
                                            selectedContest.type
                                          }
                                        </p>

                                      </div>

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          Status
                                        </p>

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          {
                                            selectedContest.status
                                          }
                                        </p>

                                      </div>

                                    </div>

                                    {/* WINNER CRITERIA + TARGET */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          Winner Criteria
                                        </p>

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          {
                                            selectedContest.winnerCriteria ||
                                            "Not specified"
                                          }
                                        </p>

                                      </div>

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          Target Value
                                        </p>

                                        <p className="text-xs font-bold text-orange-600 mt-1">
                                          {
                                            selectedContest.targetValue ??
                                            "Not specified"
                                          }
                                        </p>

                                      </div>

                                    </div>

                                    {/* GAMES */}

                                    <div>

                                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                        Games
                                      </p>

                                      {selectedContest.gameIds &&
                                      selectedContest.gameIds.length >
                                        0 ? (

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          🎮{" "}
                                          {
                                            selectedContest
                                              .gameIds
                                              .length
                                          }{" "}
                                          game
                                          {selectedContest.gameIds.length !==
                                          1
                                            ? "s"
                                            : ""}
                                        </p>

                                      ) : (

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          🌐 All Games
                                        </p>

                                      )}

                                    </div>

                                    {/* DATES */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          Start Date
                                        </p>

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          {formatDate(
                                            selectedContest.startDate
                                          )}
                                        </p>

                                      </div>

                                      <div>

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          End Date
                                        </p>

                                        <p className="text-xs font-bold text-slate-700 mt-1">
                                          {formatDate(
                                            selectedContest.endDate
                                          )}
                                        </p>

                                      </div>

                                    </div>

                                    {/* WINNERS */}

                                    <div>

                                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                        Winners
                                      </p>

                                      {selectedContest.winners &&
                                      selectedContest.winners.length >
                                        0 ? (

                                        <div className="mt-2 space-y-2">

                                          {selectedContest.winners.map(
                                            (
                                              winner,
                                              index
                                            ) => (

                                              <div
                                                key={`${winner.childId}-${index}`}
                                                className="p-3 bg-white rounded-xl border border-slate-200"
                                              >

                                                <p className="text-xs font-bold text-slate-700">
                                                  🏆 Winner{" "}
                                                  {index +
                                                    1}
                                                </p>

                                                <p className="text-[11px] text-slate-500 mt-1">
                                                  Child Name:{" "}
                                                  {
                                                    winner.childName
                                                  }
                                                </p>

                                                <p className="text-[11px] text-slate-500">
                                                  Reward:{" "}
                                                  {
                                                    winner.reward
                                                  }
                                                </p>

                                                <p className="text-[11px] text-slate-500">
                                                  Earned:{" "}
                                                  {formatDate(
                                                    winner.earnedAt
                                                  )}
                                                </p>

                                              </div>

                                            )
                                          )}

                                        </div>

                                      ) : (

                                        <p className="text-xs text-slate-500 mt-1">
                                          No winners yet.
                                        </p>

                                      )}

                                    </div>

                                    {/* UPDATE */}

                                    <div className="pt-3 border-t border-slate-200">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateContest(
                                            selectedContest
                                          )
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wide hover:bg-blue-700 transition-colors"
                                      >
                                        ✏️ Update Contest
                                      </button>

                                    </div>

                                  </div>

                                )}

                            </div>

                          )}

                        </div>

                        {/* ====================================== */}
                        {/* CARD FOOTER */}
                        {/* ====================================== */}

                        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">

                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Contest
                          </span>

                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {contest.gameIds?.length
                              ? `${contest.gameIds.length} Game${
                                  contest.gameIds.length !==
                                  1
                                    ? "s"
                                    : ""
                                }`
                              : "All Games"}
                          </span>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

          </div>

        </div>

      </AdminDashboardLayout>

      {/* ====================================================== */}
      {/* CREATE / UPDATE MODAL */}
      {/* ====================================================== */}

      <CreateContestModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onCreated={handleContestSaved}
        contest={contestToEdit}
      />

    </>
  );
};

export default Contests;