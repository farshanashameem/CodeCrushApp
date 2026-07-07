import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import { createLevel, updateLevel } from "../../../../redux/Slices/LevelSlice";

import TypingWordCard from "./TypingWordCard";
import type { TypingConfig, Level } from "../../../../Types/level";

interface Props {
  levelNumber?: number;
  initialLevel?: Level;
  isEditPage?: boolean;
}

const cardClass =
  "bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-xl";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400";

const labelClass = "block mb-2 text-sm font-semibold text-slate-700";

const TypingTitansLevelForm = ({
  levelNumber,
  initialLevel,
  isEditPage = false,
}: Props) => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const config = initialLevel?.config as TypingConfig | undefined;

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialLevel?.difficulty ?? "easy",
  );
  const [timer, setTimer] = useState(initialLevel?.timer ?? 60);
  const [words, setWords] = useState<string[]>(config?.words ?? []);
  const [wordInput, setWordInput] = useState("");
  const [isEditing, setIsEditing] = useState(!isEditPage);

  const addWord = () => {
    const value = wordInput.trim();

    if (!value) return toast.error("Please enter a word");

    if (  words.some( word => word.toLowerCase() === value.toLowerCase() ) )
    return toast.error("Word already exists");

    setWords((prev) => [...prev, value]);
    setWordInput("");
  };
  console.log(" initial level: ", initialLevel);
  const deleteWord = (index: number) => {
    setWords((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const moveWord = (index: number, direction: -1 | 1) => {
    const target = index + direction;

    if (target < 0 || target >= words.length) return;

    const updated = [...words];

    [updated[index], updated[target]] = [updated[target], updated[index]];

    setWords(updated);
  };

  const handleSubmit = async () => {
    

    if (!words.length) return toast.error("Add at least one word");

    try {
      if (isEditPage && initialLevel) {
        await dispatch(
          updateLevel({
            levelId: initialLevel.id,
            data: {
              difficulty,
              timer,
              maxScore: 100,
              config: { words },
            },
          }),
        ).unwrap();

        toast.success("Level updated");
        setIsEditing(false);
        navigate(`/admin/games/${initialLevel.gameId}/levels`);
        return;
      }
    if (!gameId)
      return toast.error("Game ID missing");
      await dispatch(
        createLevel({
          gameId,
          levelNumber: levelNumber!,
          difficulty,
          timer,
          maxScore: 100,
          config: { words },
        }),
      ).unwrap();

      toast.success("Level created");

      navigate(`/admin/games/${gameId}/levels`);
    } catch {
      toast.error(isEditPage ? "Update failed" : "Create failed");
    }
  };

  const handleCancel = () => {
    if (!initialLevel) return;

    setDifficulty(initialLevel.difficulty);
    setTimer(initialLevel.timer);

    const config = initialLevel.config as TypingConfig;

    setWords(config.words);

    setWordInput("");
    setIsEditing(false);
  };

  return (
    <>
      <div className={cardClass}>
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          {isEditPage ? "Typing Titans Level Details" : "Level Settings"}
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Difficulty</label>

            <select
              disabled={!isEditing}
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as typeof difficulty)
              }
              className={inputClass}
            >
              <option value="easy">Easy</option>

              <option value="medium">Medium</option>

              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Timer</label>

            <input
              disabled={!isEditing}
              type="number"
              min={10}
              value={timer}
              onChange={(event) => setTimer(Number(event.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Max Score</label>

            <div className="px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              100 Points
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} mt-6`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-mochiy text-lg text-indigo-700">Words</h2>
        </div>

        {isEditing && (
          <div className="flex gap-3 mb-5">
            <input
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWord()}
              placeholder="Enter word or phrase"
              className={inputClass}
            />

            <button
              onClick={addWord}
              className="px-5 rounded-xl bg-indigo-600 text-white"
            >
              Add
            </button>
          </div>
        )}

        {!words.length ? (
          <div className="text-center py-16 text-slate-500">
            No Words Added Yet
          </div>
        ) : (
          <div className="space-y-4">
            {words.map((word, index) => (
              <TypingWordCard
                key={`${word}-${index}`}
                word={word}
                index={index}
                totalWords={words.length}
                isEditing={isEditing}
                onDelete={deleteWord}
                onMoveUp={() => moveWord(index, -1)}
                onMoveDown={() => moveWord(index, 1)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {isEditPage && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-3 rounded-2xl bg-indigo-600 text-white"
          >
            Edit Level
          </button>
        )}

        {isEditPage && isEditing && (
          <button
            onClick={handleCancel}
            className="px-8 py-3 rounded-2xl bg-slate-500 text-white"
          >
            Cancel
          </button>
        )}

        {isEditing && (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-emerald-600 text-white"
          >
            {isEditPage ? "Update Level" : "Create Level"}
          </button>
        )}
      </div>
    </>
  );
};

export default TypingTitansLevelForm;
