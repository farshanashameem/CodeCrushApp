interface Props {
  word: string;
  index: number;
  totalWords: number;
  isEditing: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
}

const TypingWordCard = ({
  word,
  index,
  totalWords,
  isEditing,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) => {
  const first = index === 0;
  const last = index === totalWords - 1;

  return (
    <div className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-4 shadow-lg">

      <div className="flex justify-between">

        <div>
          <h3 className="font-mochiy text-sm text-indigo-700">
            Word {index + 1}
          </h3>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            {word}
          </p>
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

      {isEditing && (
        <div className="mt-4 flex gap-2">

          <button
            disabled={first}
            onClick={() => onMoveUp(index)}
            className="rounded-lg bg-indigo-100 px-3 py-1 text-xs text-indigo-700"
          >
            ↑ Up
          </button>

          <button
            disabled={last}
            onClick={() => onMoveDown(index)}
            className="rounded-lg bg-indigo-100 px-3 py-1 text-xs text-indigo-700"
          >
            ↓ Down
          </button>

        </div>
      )}

    </div>
  );
};

export default TypingWordCard;