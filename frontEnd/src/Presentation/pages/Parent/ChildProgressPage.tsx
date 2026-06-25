import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  getChildDetail,
  toggleChildStatus,
} from "../../../redux/Slices/ChildManagementSlice";
import AuthLayout from "../../layouts/AuthLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { avatarMap } from "../../../Constants/avatarMap";
import { startChildSession } from "../../../redux/Slices/childGameSlice";
// Asset imports
import mouseTracker from "../../../assets/games/MouseTrackers.png";
import colorSorter from "../../../assets/games/ColourSorterSafari.png";
import typingTitans from "../../../assets/games/TypingTitans.png";
import picturepuzzler from "../../../assets/games/PicturePuzzlers.png";
import toast from "react-hot-toast";

const ALL_GAMES = [
  { name: "Mouse Tracker", color: "bg-orange-400", image: mouseTracker },
  { name: "Typing Titans", color: "bg-blue-400", image: typingTitans },
  { name: "Color Sorter", color: "bg-purple-400", image: colorSorter },
  { name: "Picture Puzzle", color: "bg-pink-400", image: picturepuzzler },
];

const ChildProgressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  // 1. ALL HOOKS MUST BE DECLARED UNCONDITIONALLY AT THE TOP
  const { selectedChild, loading } = useSelector(
    (state: RootState) => state.childManagement,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    "BLOCK" | "UNBLOCK" | "DELETE" | "RESTORE" | null
  >(null);

  useEffect(() => {
    if (id) {
      dispatch(getChildDetail({ id }));
    }
  }, [dispatch, id]);

  const child = selectedChild;

  // 2. ALL HANDLERS AND COMPONENT METHOD LOGIC
  const handleConfirm = async () => {
    try {
      if (!child?.id || !modalAction) return;

      await dispatch(
        toggleChildStatus({ id: child.id, action: modalAction }),
      ).unwrap();

      await dispatch(getChildDetail({ id: child.id })).unwrap();

      toast.success("Status updated successfully");

      setIsModalOpen(false);
      setModalAction(null);
    } catch (error) {
      console.log("ERROR:", error);
      setIsModalOpen(false);
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

  const handleStartGaming = async () => {
    try {
      if (!child?.id) return;

      await dispatch(startChildSession(child.id)).unwrap();
      localStorage.setItem(
        "child",
        JSON.stringify({
          id: child.id,
          name: child.name,
          avatar: child.avatar,
          age: child.age,
          games: child.games
        }),
      );

      window.open(`/play/${child.id}`, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to start gaming session",
      );
    }
  };

  // 3. CONDITIONAL SAFETY RETURNS ARE SAFE TO RUN DOWN HERE
  if (loading) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px] text-gray-500 font-medium">
          Loading...
        </div>
      </AuthLayout>
    );
  }

  if (!child) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px] text-gray-500 font-medium">
          Child not found
        </div>
      </AuthLayout>
    );
  }

  // Map backend games safely now that child data availability is guaranteed
  const gamesMap: Record<string, any> = {};
  (child.games || []).forEach((g) => {
    gamesMap[g.gameName] = g;
  });

  // Dummy data for testing
  if (!gamesMap["Mouse Tracker"]) {
    gamesMap["Mouse Tracker"] = {
      gameName: "Mouse Tracker",
      level: 4,
      stars: 5,
      progress: 92,
      bestScore: 850,
      totalTime: "2h 15m",
      lastPlayed: "Today",
    };
  }

  if (!gamesMap["Typing Titans"]) {
    gamesMap["Typing Titans"] = {
      gameName: "Typing Titans",
      level: 2,
      stars: 3,
      progress: 48,
      bestScore: 420,
      totalTime: "45m",
      lastPlayed: "Yesterday",
    };
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col transition-all duration-500">
        {/* TOP BREADCRUMB NAVIGATION */}
        <div className="mb-4 self-start">
          <button
            onClick={() => navigate(-1)}
            className="text-sky-800 hover:text-[#1a3a6d] font-mochiy text-xs uppercase transition-colors flex items-center gap-1.5"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* CHILD METRICS HERO CARD */}
        <div className="w-full bg-gradient-to-br from-[#e1f5fe] to-[#b3e5fc]/40 rounded-3xl p-6 md:p-8 shadow-md border border-blue-100/50 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Visual Portrait & Meta details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full md:w-auto">
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

            {/* Management Action Group */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-blue-200/40 pt-4 md:pt-0">
              <button
                onClick={() => navigate(`/parent/child/edit/${child.id}`)}
                className="bg-white hover:bg-gray-50 active:scale-95 text-[#1a3a6d] border border-gray-200 px-5 py-3 rounded-full font-mochiy text-xs shadow-sm transition-all flex items-center gap-2"
              >
                ✏️ Edit Profile
              </button>

              <button
                onClick={() => triggerBlockAction()}
                className={`px-5 py-3 rounded-full font-mochiy text-xs active:scale-95 transition-all flex items-center gap-2 shadow-sm border
                  ${
                    child.status === "BLOCKED"
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-700"
                      : "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                  }`}
              >
                ⏸{" "}
                {child.status === "BLOCKED"
                  ? "Unblock Explorer"
                  : "Block Explorer"}
              </button>

              <button
                onClick={() => triggerDeleteAction()}
                className={`px-5 py-3 rounded-full font-mochiy text-xs active:scale-95 transition-all flex items-center gap-2 border shadow-sm
                  ${
                    child.status === "DELETED"
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
                      : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
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

        {/* PROGRESS ACTIVITY LABELS TRACKER */}
        <div className="mb-6">
          <h3 className="font-mochiy text-[#1a3a6d] text-lg tracking-wide uppercase">
            Game Statistics
          </h3>
          <p className="text-sm text-blue-800 font-medium">
            Review detailed execution progress, scores and engagement metrics
            below
          </p>
        </div>

        {/* GAMES TRACKING GRID SYSTEM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {ALL_GAMES.map((game, index) => {
            const played = gamesMap[game.name];
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Visual Banner Media Asset */}
                <div className="h-28 bg-gray-50 relative overflow-hidden border-b border-gray-100">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-300"
                  />
                  {played && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] text-white font-mochiy tracking-wider">
                      LVL {played.level}
                    </div>
                  )}
                </div>

                {/* Info & Analytics Dashboard Breakdown */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-[#1a3a6d] text-sm mb-2 truncate text-center uppercase group-hover:text-blue-600 transition-colors">
                    {game.name}
                  </h4>

                  {played ? (
                    <>
                      {/* Interactive Milestone Stars */}
                      <div className="flex justify-center gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-base leading-none ${i < (played.stars || 0) ? "text-amber-400" : "text-gray-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Percentage Tracking Node */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1 tracking-wider">
                          <span>COMPLETION</span>
                          <span>{played.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`${game.color} h-full rounded-full transition-all duration-1000`}
                            style={{ width: `${played.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Explicit Highscore/Time Data Rows */}
                      <div className="space-y-1.5 mt-auto">
                        <div className="flex justify-between items-center bg-gray-50/70 px-2.5 py-1.5 rounded-xl border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                            Best Score
                          </span>
                          <span className="text-[10px] font-mochiy text-[#1a3a6d]">
                            {played.bestScore || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50/70 px-2.5 py-1.5 rounded-xl border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                            Total Time
                          </span>
                          <span className="text-[10px] font-mochiy text-[#1a3a6d]">
                            {played.totalTime || "-"}
                          </span>
                        </div>
                      </div>

                      <p className="text-center text-[9px] font-semibold text-gray-400 mt-2.5 pt-2 border-t border-gray-50 uppercase tracking-tight">
                        Played: {played.lastPlayed || "-"}
                      </p>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center min-h-[120px]">
                      <p className="text-center text-xs text-gray-400 font-medium italic bg-gray-50 w-full py-4 rounded-xl border border-dashed border-gray-200">
                        Not yet unlocked
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Gaming */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleStartGaming}
            disabled={child.status === "BLOCKED" || child.status === "DELETED"}
            className="
      px-10 py-4 rounded-full
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:from-blue-700 hover:to-indigo-700
      disabled:opacity-50 disabled:cursor-not-allowed
      text-white font-mochiy text-sm
      shadow-lg hover:shadow-xl
      transition-all duration-300
      active:scale-95
    "
          >
            🎮 Start Gaming
          </button>
        </div>

        {/* ACCOUNT CONFIRMATION DIALOG MODAL CONTROLLER */}
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
