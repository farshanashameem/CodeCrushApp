import type { ColorSorterItemForm } from "../../../../Types/colourSorter";

interface ColorSorterItemCardProps {
  item: ColorSorterItemForm;
  index: number;
  totalItems: number;
  isEditing: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
}

const ColorSorterItemCard = ({
  item,
  index,
  totalItems,
  isEditing,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ColorSorterItemCardProps) => {
  const firstItem = index === 0;
  const lastItem = index === totalItems - 1;

  return (
    <div className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-4 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-mochiy text-sm text-indigo-700">
            Item {index + 1}
          </h3>

          <p className="text-xs text-slate-500">{item.category}</p>
        </div>

        {isEditing && (
          <button
            onClick={() => onDelete(index)}
            className="rounded-lg bg-rose-500 px-3 py-1 text-xs text-white"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center text-3xl shadow">
          {item.iconKey}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-700 text-sm truncate">
            {item.iconName}
          </p>

          <p className="text-xs text-slate-500">Color: {item.color}</p>

          <p className="text-xs text-slate-500">Count: {item.count}</p>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 flex gap-2">
          <button
            disabled={firstItem}
            onClick={() => onMoveUp(index)}
            className="rounded-lg px-3 py-1 text-xs bg-indigo-100 text-indigo-700"
          >
            ↑ Up
          </button>

          <button
            disabled={lastItem}
            onClick={() => onMoveDown(index)}
            className="rounded-lg px-3 py-1 text-xs bg-indigo-100 text-indigo-700"
          >
            ↓ Down
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorSorterItemCard;
