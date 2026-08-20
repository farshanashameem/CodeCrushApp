import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../../redux/store";

import {
  getChildDetail,
  toggleChildStatus,
} from "../../../redux/Slices/ChildManagementSlice";

import {
  getGameReview,
  getGameReviews,
  createGameReview,
  clearSelectedReview,
  clearGameReviews,
} from "../../../redux/Slices/GameReviewSlice";

import AuthLayout from "../../layouts/AuthLayout";
import ConfirmationModal from "../../SharedComponents/ConfirmationModal";

import { avatarMap } from "../../../Constants/avatarMap";
import {
  
  fetchGames,
  startChildSession,
} from "../../../redux/Slices/childGameSlice";

import mouseTracker from "../../../assets/games/MouseTrackers.png";
import colorSorter from "../../../assets/games/ColourSorterSafari.png";
import typingTitans from "../../../assets/games/TypingTitans.png";
import picturepuzzler from "../../../assets/games/PicturePuzzlers.png";

import toast from "react-hot-toast";

const ALL_GAMES = [
  {
    name: "Mouse Trackers",
    color: "bg-orange-400",
    image: mouseTracker,
  },
  {
    name: "Typing Titans",
    color: "bg-blue-400",
    image: typingTitans,
  },
  {
    name: "Colour Sorter Safari",
    color: "bg-purple-400",
    image: colorSorter,
  },
  {
    name: "Picture Puzzlers",
    color: "bg-pink-400",
    image: picturepuzzler,
  },
];

const ChildProgressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();

  // ==========================================================
  // CHILD STATE
  // ==========================================================

  const { selectedChild, loading } = useSelector(
    (state: RootState) => state.childManagement,
  );

  // ==========================================================
  // GAME STATE
  // ==========================================================

  const { games } = useSelector((state: RootState) => state.childGame);

  useEffect(() => {
  
  dispatch(fetchGames())
    .unwrap()
   
}, [dispatch]);

  // ==========================================================
  // REVIEW STATE
  // ==========================================================

  const {
    selectedReview: review,
    reviews,    
    loading: reviewLoading,
  } = useSelector((state: RootState) => state.gameReview);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalAction, setModalAction] = useState<
    "BLOCK" | "UNBLOCK" | "DELETE" | "RESTORE" | null
  >(null);

  // ==========================================================
  // REVIEW UI STATE
  // ==========================================================

  const [selectedReviewGame, setSelectedReviewGame] = useState<string | null>(
    null,
  );

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [isEditingReview, setIsEditingReview] = useState(false);

  const [rating, setRating] = useState(0);

  const [reviewText, setReviewText] = useState("");

  // ==========================================================
  // FETCH CHILD
  // ==========================================================

  useEffect(() => {
    if (id) {
      dispatch(getChildDetail({ id }));
    }
  }, [dispatch, id]);

  const child = selectedChild;

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // TIME FORMAT
  // ==========================================================

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;

    return `${s}s`;
  };

  // ==========================================================
  // BLOCK / UNBLOCK / DELETE / RESTORE
  // ==========================================================

  const handleConfirm = async () => {
    try {
      if (!child?.id || !modalAction) return;

      await dispatch(
        toggleChildStatus({
          id: child.id,
          action: modalAction,
        }),
      ).unwrap();

      await dispatch(
        getChildDetail({
          id: child.id,
        }),
      ).unwrap();

      toast.success("Status updated successfully");

      setIsModalOpen(false);
      setModalAction(null);
    } catch (error) {
      console.log("ERROR:", error);

      setIsModalOpen(false);
      setModalAction(null);

      toast.error(
        typeof error === "string" ? error : "Failed to update child status",
      );
    }
  };

  const triggerBlockAction = () => {
    setModalAction(child?.status === "BLOCKED" ? "UNBLOCK" : "BLOCK");

    setIsModalOpen(true);
  };

  const triggerDeleteAction = () => {
    setModalAction(child?.status === "DELETED" ? "RESTORE" : "DELETE");

    setIsModalOpen(true);
  };

  // ==========================================================
  // START GAMING
  // ==========================================================

  const handleStartGaming = async () => {
    try {
      if (!child?.id) return;

      await dispatch(startChildSession(child.id)).unwrap();

      window.open("/play", "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to start gaming session",
      );
    }
  };

  // ==========================================================
  // SHOW REVIEWS
  // ==========================================================

  const handleShowReviews = async (gameId: string) => {
    if (!child?.id || !gameId) {
      toast.error("Game information is missing");
      return;
    }

    try {
      // ------------------------------------------------------
      // CLEAR PREVIOUS REVIEW DATA
      // ------------------------------------------------------

      dispatch(clearSelectedReview());
      dispatch(clearGameReviews());

      setSelectedReviewGame(gameId);
      setIsReviewOpen(true);
      setIsEditingReview(false);
      setRating(0);
      setReviewText("");

      // ------------------------------------------------------
      // GET ALL REVIEWS FOR THIS GAME
      // ------------------------------------------------------

      await dispatch(getGameReviews(gameId)).unwrap();

      // ------------------------------------------------------
      // GET CURRENT CHILD'S REVIEW
      // ------------------------------------------------------

      try {
        await dispatch(
          getGameReview({
            childId: child.id,
            gameId,
          }),
        ).unwrap();
      } catch (error) {
        // No review is a valid state.
        console.log("Current child has no review yet:", error);

        dispatch(clearSelectedReview());
      }
    } catch (error) {
      console.log("Review loading error:", error);

      toast.error(typeof error === "string" ? error : "Failed to load reviews");
    }
  };

  // ==========================================================
  // CALCULATE REVIEW SUMMARY
  // ==========================================================

  /*
   * Calculate these values directly from the reviews array.
   *
   */

  const validReviews = Array.isArray(reviews)
    ? reviews.filter(
        (item: any) =>
          typeof item?.rating === "number" &&
          item.rating >= 1 &&
          item.rating <= 5,
      )
    : [];

  const calculatedTotalReviews = validReviews.length;

  const calculatedAverageRating =
    calculatedTotalReviews > 0
      ? validReviews.reduce(
          (sum: number, item: any) => sum + Number(item.rating),
          0,
        ) / calculatedTotalReviews
      : 0;

  // ==========================================================
  // START ADD / UPDATE REVIEW
  // ==========================================================

  const handleStartReview = () => {
    if (review) {
      // Existing review -> UPDATE mode

      setRating(Number(review.rating) || 0);

      setReviewText(review.review || "");
    } else {
      // No review -> ADD mode

      setRating(0);

      setReviewText("");
    }

    setIsEditingReview(true);
  };

  // ==========================================================
  // SAVE REVIEW
  // ==========================================================

  const handleSaveReview = async () => {
    if (!child?.id || !selectedReviewGame) {
      toast.error("Child or game information is missing");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await dispatch(
        createGameReview({
          childId: child.id,
          gameId: selectedReviewGame,
          rating,
          review: reviewText.trim() || undefined,
        }),
      ).unwrap();

      toast.success(
        review ? "Review updated successfully" : "Review added successfully",
      );

      // ------------------------------------------------------
      // REFRESH ALL REVIEWS
      // ------------------------------------------------------

      await dispatch(getGameReviews(selectedReviewGame)).unwrap();

      // ------------------------------------------------------
      // REFRESH CURRENT CHILD'S REVIEW
      // ------------------------------------------------------

      try {
        await dispatch(
          getGameReview({
            childId: child.id,
            gameId: selectedReviewGame,
          }),
        ).unwrap();
      } catch (error) {
        console.log("Unable to refresh current child's review:", error);
      }

      setIsEditingReview(false);
    } catch (error) {
      console.log("Save review error:", error);

      toast.error(typeof error === "string" ? error : "Failed to save review");
    }
  };

  // ==========================================================
  // CLOSE REVIEW SECTION
  // ==========================================================

  const handleCloseReviews = () => {
    setIsReviewOpen(false);

    setSelectedReviewGame(null);

    setIsEditingReview(false);

    setRating(0);

    setReviewText("");

    dispatch(clearSelectedReview());

    dispatch(clearGameReviews());
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px] text-gray-500 font-medium">
          Loading...
        </div>
      </AuthLayout>
    );
  }

  // ==========================================================
  // CHILD NOT FOUND
  // ==========================================================

  if (!child) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px] text-gray-500 font-medium">
          Child not found
        </div>
      </AuthLayout>
    );
  }

  // ==========================================================
  // GAMES MAP
  // ==========================================================

  const gamesMap: Record<string, any> = {};

  (child.games || []).forEach((g) => {
    gamesMap[g.gameName] = g;
  });

  const AllGamesMap: Record<string, any> = {};
  (games || []).forEach((g) => {
    AllGamesMap[g.name] = g;
  });

  // ==========================================================
  // SELECTED GAME
  // ==========================================================

  const selectedGame = ALL_GAMES.find(
    (game) => game.name === gamesMap[selectedReviewGame || ""]?.gameName,
  );

  // ==========================================================
  // OTHER REVIEWS
  // ==========================================================

  /*
   * IMPORTANT:
   *
   * The current child's review is already displayed in
   * "Your Child's Review".
   *
   * Therefore it MUST be removed from "Other Reviews".
   */

  const otherReviews = Array.isArray(reviews)
    ? reviews.filter((item: any) => String(item.childId) !== String(child.id))
    : [];

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col transition-all duration-500">
        {/* ==================================================
            BACK
        ================================================== */}

        <div className="mb-4 self-start">
          <button
            onClick={() => navigate(-1)}
            className="text-sky-800 hover:text-[#1a3a6d] font-mochiy text-xs uppercase transition-colors flex items-center gap-1.5"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ==================================================
            CHILD HERO
        ================================================== */}

        <div className="w-full bg-gradient-to-br from-[#e1f5fe] to-[#b3e5fc]/40 rounded-3xl p-6 md:p-8 shadow-md border border-blue-100/50 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* CHILD INFO */}

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 p-1 border border-blue-200 shadow-inner overflow-hidden">
                <img
                  src={avatarMap[child.avatar as keyof typeof avatarMap]}
                  alt={child.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <h1 className="font-mochiy text-[#1a3a6d] text-2xl tracking-tight uppercase mb-1">
                  {child.name}'s{" "}
                  <span className="text-orange-500">Activity</span>
                </h1>

                <p className="text-gray-600 text-sm font-semibold bg-white/70 px-3 py-1 rounded-full inline-block border border-blue-100">
                  Age {child.age} Explorer
                </p>
              </div>
            </div>

            {/* MANAGEMENT BUTTONS */}

            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              <button
                onClick={() => navigate(`/parent/child/edit/${child.id}`)}
                className="bg-white hover:bg-gray-50 text-[#1a3a6d] border border-gray-200 px-5 py-3 rounded-full font-mochiy text-xs shadow-sm"
              >
                ✏️ Edit Profile
              </button>

              <button
                onClick={triggerBlockAction}
                className={`px-5 py-3 rounded-full font-mochiy text-xs shadow-sm border ${
                  child.status === "BLOCKED"
                    ? "bg-green-600 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                ⏸{" "}
                {child.status === "BLOCKED"
                  ? "Unblock Explorer"
                  : "Block Explorer"}
              </button>

              <button
                onClick={triggerDeleteAction}
                className={`px-5 py-3 rounded-full font-mochiy text-xs border ${
                  child.status === "DELETED"
                    ? "bg-blue-600 text-white"
                    : "bg-red-50 text-red-600"
                }`}
              >
                🗑️{" "}
                {child.status === "DELETED"
                  ? "Restore Account"
                  : "Remove Account"}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            GAME STATISTICS
        ================================================== */}

        <div className="mb-6">
          <h3 className="font-mochiy text-[#1a3a6d] text-lg tracking-wide uppercase">
            Game Statistics
          </h3>

          <p className="text-sm text-blue-800 font-medium">
            Review detailed execution progress, scores and engagement metrics
            below
          </p>
        </div>

        {/* ==================================================
            GAME CARDS
        ================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {ALL_GAMES.map((game, index) => {
            const played = gamesMap[game.name];
            const gameData = AllGamesMap[game.name];

            const averageScore = played?.totalAttempts
              ? Math.round(played.totalScore / played.totalAttempts)
              : 0;

            const averageStars = played?.totalAttempts
              ? played.totalStars / played.totalAttempts
              : 0;

            /*
             * Game review API needs gameId.
             */

            const gameId = gameData?.id;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* IMAGE */}

                <div className="h-28 bg-gray-50 relative overflow-hidden border-b border-gray-100">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-300"
                  />

                  {played && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] text-white font-mochiy tracking-wider">
                      LVL {played.currentLevel}
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-[#1a3a6d] text-sm mb-2 truncate text-center uppercase">
                    {game.name}
                  </h4>

                  {played ? (
                    <>
                      {/* STARS */}

                      <div className="flex justify-center gap-0.5 mb-3">
                        {[...Array(3)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-base ${
                              i < Math.round(averageStars)
                                ? "text-amber-400"
                                : "text-gray-200"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* STATISTICS */}

                      <div className="space-y-1.5">
                        <div className="flex justify-between bg-gray-50 px-2.5 py-1.5 rounded-xl">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            Average Score
                          </span>

                          <span className="text-[10px] font-mochiy text-[#1a3a6d]">
                            {averageScore || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between bg-gray-50 px-2.5 py-1.5 rounded-xl">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            Play Time
                          </span>

                          <span className="text-[10px] font-mochiy text-[#1a3a6d]">
                            {formatTime(played.playTime)}
                          </span>
                        </div>

                        <div className="flex justify-between bg-gray-50 px-2.5 py-1.5 rounded-xl">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            Attempts
                          </span>

                          <span className="text-[10px] font-mochiy text-[#1a3a6d]">
                            {played.totalAttempts}
                          </span>
                        </div>
                      </div>

                      <p className="text-center text-[9px] font-semibold text-gray-400 mt-2.5 pt-2 border-t border-gray-50 uppercase">
                        Last Played: {formatDate(played.lastPlayed)}
                      </p>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center min-h-[120px]">
                      <p className="text-center text-xs text-gray-400 italic bg-gray-50 w-full py-4 rounded-xl border border-dashed">
                        Not yet unlocked
                      </p>
                    </div>
                  )}

                  {/* SHOW REVIEWS */}

                  <button
                    onClick={() => {
                      if (!gameId) {
                        toast.error("Game ID is not available");
                        return;
                      }

                      handleShowReviews(gameId);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-[#1a3a6d] font-mochiy text-[10px] transition-all"
                  >
                    ⭐ Show Reviews
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================
            REVIEW SECTION
        ================================================== */}

        {isReviewOpen && selectedReviewGame && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl border border-blue-100 shadow-md p-6 md:p-8">
              {/* ==================================================
                  REVIEW HEADER
              ================================================== */}

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-mochiy text-[#1a3a6d] text-lg uppercase">
                    Game Reviews
                  </h2>

                  <p className="text-sm text-blue-700 font-medium mt-1">
                    {selectedGame?.name || "Selected Game"}
                  </p>
                </div>

                <button
                  onClick={handleCloseReviews}
                  className="text-gray-400 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* ==================================================
                  SUMMARY
              ================================================== */}

              {!reviewLoading && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* TOTAL REVIEWS */}

                  <div className="bg-blue-50 rounded-2xl px-5 py-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Total Reviews
                    </p>

                    <p className="text-lg font-mochiy text-[#1a3a6d]">
                      {calculatedTotalReviews}
                    </p>
                  </div>

                  {/* AVERAGE RATING */}

                  <div className="bg-amber-50 rounded-2xl px-5 py-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Average Rating
                    </p>

                    <p className="text-lg font-mochiy text-amber-500">
                      ⭐ {calculatedAverageRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              )}

              {/* ==================================================
                  LOADING
              ================================================== */}

              {reviewLoading ? (
                <div className="py-10 text-center text-gray-400">
                  Loading reviews...
                </div>
              ) : (
                <>
                  {/* ==================================================
                      YOUR CHILD'S REVIEW
                  ================================================== */}

                  <div className="mb-8">
                    <h3 className="font-mochiy text-[#1a3a6d] text-sm uppercase mb-3">
                      Your Child's Review
                    </h3>

                    {/* ==================================================
                        EDIT / ADD MODE
                    ================================================== */}

                    {isEditingReview ? (
                      <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                          Rating
                        </p>

                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`text-2xl transition ${
                                star <= rating
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          maxLength={500}
                          rows={4}
                          placeholder="Write your review..."
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                        />

                        <p className="text-right text-[10px] text-gray-400 mt-1">
                          {reviewText.length}/500
                        </p>

                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            onClick={() => setIsEditingReview(false)}
                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleSaveReview}
                            disabled={reviewLoading}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold"
                          >
                            {review ? "Update Review" : "Add Review"}
                          </button>
                        </div>
                      </div>
                    ) : review ? (
                      /* ==================================================
                          CURRENT CHILD'S REVIEW
                      ================================================== */

                      <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  star <= Number(review.rating)
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          {/* UPDATE BUTTON */}

                          <button
                            onClick={handleStartReview}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                          >
                            ✏️ Update
                          </button>
                        </div>

                        <p className="text-sm text-gray-700 mt-3">
                          {review.review || "No written review."}
                        </p>

                        {review.updatedAt && (
                          <p className="text-[10px] text-gray-400 mt-3">
                            Updated: {formatDate(review.updatedAt.toString())}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* ==================================================
                          NO CURRENT CHILD REVIEW
                      ================================================== */

                      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                        <p className="text-sm text-gray-400 italic mb-4">
                          No review yet.
                        </p>

                        <button
                          onClick={handleStartReview}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mochiy text-xs"
                        >
                          ⭐ Add Review
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ==================================================
                        OTHER CHILDREN'S REVIEWS
                   ================================================== */}

                  <div>
                    <h3 className="font-mochiy text-[#1a3a6d] text-sm uppercase mb-3">
                      Other Reviews
                    </h3>

                    {otherReviews.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400 italic">
                        No other reviews yet.
                      </div>
                    ) : (
                      <div
                        className="
        space-y-3
        max-h-[420px]
        overflow-y-auto
        pr-2
        scrollbar-thin
        scrollbar-thumb-blue-200
        scrollbar-track-gray-100
      "
                      >
                        {otherReviews.map((item: any, index: number) => (
                          <div
                            key={item.id || index}
                            className="bg-gray-50 rounded-2xl border border-gray-100 p-4"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-[#1a3a6d]">
                                {item.childName || "Explorer"}
                              </span>

                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={
                                      star <= Number(item.rating)
                                        ? "text-amber-400 text-sm"
                                        : "text-gray-300 text-sm"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>

                            {item.review && (
                              <p className="text-sm text-gray-600 mt-2">
                                "{item.review}"
                              </p>
                            )}

                            {item.createdAt && (
                              <p className="text-[10px] text-gray-400 mt-2">
                                {formatDate(item.createdAt)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            START GAMING
        ================================================== */}

        <div className="flex justify-center mb-12">
          <button
            onClick={handleStartGaming}
            disabled={child.status === "BLOCKED" || child.status === "DELETED"}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mochiy text-sm shadow-lg transition-all active:scale-95"
          >
            🎮 Start Gaming
          </button>
        </div>

        {/* ==================================================
            CONFIRMATION MODAL
        ================================================== */}

        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirm Action"
          message={`Are you sure you want to ${modalAction?.toLowerCase()} ${child.name}'s account?`}
          onConfirm={handleConfirm}
          onCancel={() => {
            setIsModalOpen(false);
            setModalAction(null);
          }}
          confirmText="Yes"
          cancelText="No"
        />
      </div>
    </AuthLayout>
  );
};

export default ChildProgressPage;
