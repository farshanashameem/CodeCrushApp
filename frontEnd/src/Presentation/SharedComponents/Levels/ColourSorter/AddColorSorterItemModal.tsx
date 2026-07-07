import { useState } from "react";

import type { ColorSorterItemForm } from "../../../../Types/colourSorter";

interface Props {
  isOpen: boolean;

  selectedIcon: {
    id: string;
    name: string;
    iconKey: string;
    category?: string;
    color: string;
  } | null;

  onClose: () => void;

  onSave: (item: ColorSorterItemForm) => void;
}

const AddColorSorterItemModal = ({
  isOpen,
  selectedIcon,
  onClose,
  onSave,
}: Props) => {
  const [count, setCount] = useState(1);

  if (!isOpen || !selectedIcon) return null;

  const handleSave = () => {
    onSave({
      iconId: selectedIcon.id,
      iconName: selectedIcon.name,
      iconKey: selectedIcon.iconKey,
      category: selectedIcon.category,
      color: selectedIcon.color,
      count,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md">
        <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
          Configure Item
        </h2>

        <div className="space-y-4">
          <input
            disabled
            value={selectedIcon.name}
            className="w-full border rounded-xl px-4 py-3"
          />

          <div className="rounded-xl border px-4 py-3 bg-slate-50">
            Color:{" "}
            <span className="font-semibold capitalize">
              {selectedIcon.color}
            </span>
          </div>

          <input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColorSorterItemModal;
