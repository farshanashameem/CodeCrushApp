import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch, RootState } from "../../redux/store";

import {
  createContest,
  updateContest,
} from "../../redux/Slices/contestManagementSlice";

import { fetchGames } from "../../redux/Slices/gameSlice";

import type {
  Contest,
  CreateContestPayload,
  UpdateContestPayload,
} from "../../Types/ContestManagement";

import { createContestSchema, updateContestSchema } from "../../Lib/validation";

interface CreateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  contest?: Contest | null;
}

const CreateContestModal = ({
  isOpen,
  onClose,
  onCreated,
  contest,
}: CreateContestModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector(
    (state: RootState) => state.contestManagement,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ContestForm
      key={contest?.id ?? "create"}
      contest={contest}
      loading={loading}
      dispatch={dispatch}
      onClose={onClose}
      onCreated={onCreated}
    />
  );
};

interface ContestFormProps {
  contest?: Contest | null;
  loading: boolean;
  dispatch: AppDispatch;
  onClose: () => void;
  onCreated: () => void;
}

const ContestForm = ({
  contest,
  loading,
  dispatch,
  onClose,
  onCreated,
}: ContestFormProps) => {
  const isEditMode = Boolean(contest);

  const { games } = useSelector((state: RootState) => state.gameManagement);

  // ============================================================
  // FORM INITIAL STATE
  // ============================================================

  const [title, setTitle] = useState(contest?.title ?? "");
  const [description, setDescription] = useState(contest?.description ?? "");

  const [type, setType] = useState(contest?.type ?? "");

  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(
    contest?.gameIds ?? [],
  );

  const [winnerCriteria, setWinnerCriteria] = useState(
    contest?.winnerCriteria ?? "",
  );

  const [targetValue, setTargetValue] = useState(
    contest?.type === "PARTICIPATION" && contest.targetValue !== undefined
      ? String(contest.targetValue)
      : "",
  );

  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(
    formatDateForInput(contest?.startDate),
  );

  const [endDate, setEndDate] = useState(formatDateForInput(contest?.endDate));

  const [showGameDropdown, setShowGameDropdown] = useState(false);

  // ============================================================
  // FETCH GAMES
  // ============================================================

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // ============================================================
  // TARGET LOGIC
  // ============================================================

  const requiresTargetValue = type === "PARTICIPATION";

  // ============================================================
  // RESET
  // ============================================================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("");
    setSelectedGameIds([]);
    setWinnerCriteria("");
    setTargetValue("");
    setStartDate("");
    setEndDate("");
    setShowGameDropdown(false);
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  };

  // ============================================================
  // GAME TOGGLE
  // ============================================================

  const handleGameToggle = (gameId: string) => {
    setSelectedGameIds((previous) =>
      previous.includes(gameId)
        ? previous.filter((id) => id !== gameId)
        : [...previous, gameId],
    );
  };

  // ============================================================
  // TYPE CHANGE
  // ============================================================

  const handleTypeChange = (value: string) => {
    setType(value);

    if (value !== "PARTICIPATION") {
      setTargetValue("");
    }
  };

  // ============================================================
  // WINNER CRITERIA
  // ============================================================

  const handleWinnerCriteriaChange = (value: string) => {
    setWinnerCriteria(value);
    setTargetValue("");
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      type,
      gameIds: selectedGameIds.length > 0 ? selectedGameIds : undefined,
      winnerCriteria,

      targetValue: requiresTargetValue ? targetValue : undefined,

      startDate,
      endDate,
    };

    // ==========================================================
    // CREATE
    // ==========================================================

    if (!isEditMode) {
      const validation = createContestSchema.safeParse(formData);

      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });

        return;
      }

      try {
        await dispatch(
          createContest(validation.data as CreateContestPayload),
        ).unwrap();

        toast.success("Contest created successfully");

        resetForm();
        onCreated();
      } catch (error) {
        toast.error(
          typeof error === "string" ? error : "Failed creating contest",
        );
      }

      return;
    }

    // ==========================================================
    // UPDATE
    // ==========================================================

    if (contest) {
      const validation = updateContestSchema.safeParse({
        ...formData,
        id: contest.id,
      });

      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });

        return;
      }

      try {
        await dispatch(
          updateContest(validation.data as UpdateContestPayload),
        ).unwrap();

        toast.success("Contest updated successfully");

        resetForm();
        onCreated();
      } catch (error) {
        toast.error(
          typeof error === "string" ? error : "Failed updating contest",
        );
      }
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* MODAL */}

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-white/40">
        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">
                {isEditMode ? "Update Contest ✏️" : "Create Contest 🏆"}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                {isEditMode
                  ? "Update the contest configuration"
                  : "Configure a new competitive event for children"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TITLE */}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Contest Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter contest title"
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the contest"
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Contest Type
            </label>

            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">Select contest type</option>

              <option value="CHALLENGE">Challenge</option>

              <option value="PARTICIPATION">Participation</option>
            </select>

            <p className="text-[10px] text-slate-400 mt-1.5">
              {type === "CHALLENGE"
                ? "Children must reach the specified target."
                : type === "PARTICIPATION"
                  ? "Children participate based on the selected criteria."
                  : "Choose how this contest should work."}
            </p>
          </div>

          {/* WINNER CRITERIA */}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Winner Criteria
            </label>

            <select
              value={winnerCriteria}
              onChange={(e) => handleWinnerCriteriaChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">Select winner criteria</option>

              <option value="SCORE">Score</option>
              <option value="STARS">Stars</option>
              <option value="LEVELS">Levels</option>
            </select>

            <p className="text-[10px] text-slate-400 mt-1.5">
              {winnerCriteria === "SCORE"
                ? "Competition will be based on score."
                : winnerCriteria === "STARS"
                  ? "Competition will be based on stars earned."
                  : winnerCriteria === "LEVELS"
                    ? "Competition will be based on levels completed."
                    : "Select how winners should be determined."}
            </p>
          </div>

          {/* TARGET */}

          {requiresTargetValue && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Target Value
                <span className="text-rose-500 ml-1">*</span>
              </label>

              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={
                  winnerCriteria === "SCORE"
                    ? "Enter target score"
                    : winnerCriteria === "STARS"
                      ? "Enter target stars"
                      : winnerCriteria === "LEVELS"
                        ? "Enter target levels"
                        : "Enter target value"
                }
                disabled={!winnerCriteria}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <p className="text-[10px] text-slate-400 mt-1.5">
                {winnerCriteria === "SCORE"
                  ? "Example: 500 means the child must reach 500 points."
                  : winnerCriteria === "STARS"
                    ? "Example: 20 means the child must earn 20 stars."
                    : winnerCriteria === "LEVELS"
                      ? "Example: 10 means the child must complete 10 levels."
                      : "Select winner criteria to define the target."}
              </p>
            </div>
          )}

          {/* GAMES */}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Games
              <span className="ml-1 text-slate-400 normal-case font-medium">
                (Optional)
              </span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGameDropdown((previous) => !previous)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-left text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>
                  {selectedGameIds.length === 0
                    ? "Select games"
                    : `${selectedGameIds.length} game${
                        selectedGameIds.length !== 1 ? "s" : ""
                      } selected`}
                </span>

                <span className="text-slate-400">
                  {showGameDropdown ? "▲" : "▼"}
                </span>
              </button>

              {showGameDropdown && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                  {games.length === 0 ? (
                    <div className="px-4 py-4 text-xs text-slate-400 text-center">
                      No games available
                    </div>
                  ) : (
                    games.map((game) => {
                      const selected = selectedGameIds.includes(game.id);

                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => handleGameToggle(game.id)}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left text-xs transition-colors ${
                            selected
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                              selected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {selected ? "✓" : ""}
                          </span>

                          <span className="font-semibold">{game.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {selectedGameIds.length === 0 && (
              <p className="text-[10px] text-slate-400 mt-1.5">
                Leave empty if this contest is not restricted to specific games.
              </p>
            )}
          </div>

          {/* DATES */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Contest"
                  : "Create Contest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContestModal;
