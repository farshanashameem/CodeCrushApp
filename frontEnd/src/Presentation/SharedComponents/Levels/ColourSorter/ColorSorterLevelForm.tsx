import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch } from "../../../../redux/store";

import { createLevel, updateLevel } from "../../../../redux/Slices/LevelSlice";

import type { ColorSorterItemForm } from "../../../../Types/colourSorter";

import { IconSelectorModal } from "./IconSelectorModal";
import AddColorSorterItemModal from "./AddColorSorterItemModal";
import ColorSorterItemCard from "./ColorSorterItemCard";
import toast from "react-hot-toast";
import type { Level } from "../../../../Types/level";

interface ColorSorterLevelFormProps {
  levelNumber?: number;
  initialLevel?: Level;
  isEditPage?: boolean;
}

const cardClass =
  "bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-xl";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400";

const labelClass = "block mb-2 text-sm font-semibold text-slate-700";

interface SelectedIcon {
  id: string;
  name: string;
  iconKey: string;
  category?: string;
  color: string;
}

const ColorSorterLevelForm = ({
  levelNumber,
  initialLevel,
  isEditPage = false,
}: ColorSorterLevelFormProps) => {
  const { gameId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const config = initialLevel?.config as
    | {
        targetColors: string[];
        items: ColorSorterItemForm[];
      }
    | undefined;

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    initialLevel?.difficulty ?? "easy",
  );

  const [timer, setTimer] = useState(initialLevel?.timer ?? 60);

  const [items, setItems] = useState<ColorSorterItemForm[]>(
    config?.items ?? [],
  );

  const [isEditing, setIsEditing] = useState(!isEditPage);
  const [showIconModal, setShowIconModal] = useState(false);

  const [showConfigModal, setShowConfigModal] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState<SelectedIcon | null>(null);

  const handleIconSelect = (icon: SelectedIcon) => {
    setSelectedIcon(icon);

    setShowIconModal(false);

    setShowConfigModal(true);
  };

  const handleAddItem = (item: ColorSorterItemForm) => {
    setItems((prev) => [...prev, item]);
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const updatedItems = [...items];

    [updatedItems[index - 1], updatedItems[index]] = [
      updatedItems[index],
      updatedItems[index - 1],
    ];

    setItems(updatedItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;

    const updatedItems = [...items];

    [updatedItems[index], updatedItems[index + 1]] = [
      updatedItems[index + 1],
      updatedItems[index],
    ];

    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!items.length) {
      return toast.error("Please add at least one item");
    }

    const targetColors = [...new Set(items.map((item) => item.color))];

    try {
      if (isEditPage && initialLevel) {
        await dispatch(
          updateLevel({
            levelId: initialLevel.id,
            data: {
              difficulty,
              timer,
              maxScore: 100,

              config: {
                targetColors,
                items: items.map((item) => ({
                  iconId: item.iconId,
                  color: item.color,
                  count: item.count,
                })),
              },
            },
          }),
        ).unwrap();

        toast.success("Level updated");

        setIsEditing(false);

        navigate(`/admin/games/${initialLevel.gameId}/levels`);

        return;
      }

      if (!gameId) return;

      await dispatch(
        createLevel({
          gameId,
          levelNumber: levelNumber!,
          difficulty,
          timer,
          maxScore: 100,

          config: {
            targetColors,

            items: items.map((item) => ({
              iconId: item.iconId,
              color: item.color,
              count: item.count,
            })),
          },
        }),
      ).unwrap();

      toast.success("Level created successfully");

      navigate(`/admin/games/${gameId}/levels`);
    } catch {
      toast.error(isEditPage ? "Level update failed" : "Level creation failed");
    }
  };

  const handleCancel = () => {
    if (!initialLevel) return;

    const config = initialLevel.config as {
      targetColors: string[];
      items: ColorSorterItemForm[];
    };

    setDifficulty(initialLevel.difficulty);

    setTimer(initialLevel.timer);

    setItems(config.items);

    setIsEditing(false);
  };
  return (
    <>
      {/* SETTINGS */}

      <div className={cardClass}>
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          Level Settings
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
            <label className={labelClass}>Timer (Seconds)</label>

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

      {/* ITEMS */}

      <div className={`${cardClass} mt-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mochiy text-lg text-indigo-700">
            Color Sort Items
          </h2>

          {isEditing && (
            <button
              onClick={() => setShowIconModal(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              + Add Item
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="text-center py-16 text-slate-500">
            No Items Added Yet
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <ColorSorterItemCard
                key={`${item.iconId}-${item.color}-${index}`}
                item={item}
                index={index}
                isEditing={isEditing}
                totalItems={items.length}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* TARGET COLORS PREVIEW */}

      {items.length > 0 && (
        <div className={`${cardClass} mt-6`}>
          <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
            Generated Target Colors
          </h2>

          <div className="flex flex-wrap gap-3">
            {[...new Set(items.map((item) => item.color))].map((color) => (
              <div
                key={color}
                className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold capitalize"
              >
                {color}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}

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

      {/* ICON SELECTOR */}

      <IconSelectorModal
        isOpen={showIconModal}
        onClose={() => setShowIconModal(false)}
        onSelect={handleIconSelect}
      />

      {/* ITEM CONFIG */}

      <AddColorSorterItemModal
        isOpen={showConfigModal}
        selectedIcon={selectedIcon}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedIcon(null);
        }}
        onSave={handleAddItem}
      />
    </>
  );
};

export default ColorSorterLevelForm;
