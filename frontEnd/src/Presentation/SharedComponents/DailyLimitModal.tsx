interface DailyLimitModalProps {
  open: boolean;
  onBack: () => void;
}

const DailyLimitModal = ({ open, onBack }: DailyLimitModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-lg rounded-[35px] bg-white p-8 text-center shadow-2xl">

        <div className="text-7xl">🎉</div>

        <h1 className="mt-4 text-3xl font-bold text-indigo-600">
          Awesome Job!
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          You've finished your free plays for today.
        </p>

        <p className="mt-2 text-slate-500">
          Come back tomorrow for more adventures,
          or ask your parent to unlock Premium! ⭐
        </p>

        <button
          onClick={onBack}
          className="mt-8 rounded-2xl bg-indigo-500 px-8 py-3 font-bold text-white hover:bg-indigo-600"
        >
          Back to Levels
        </button>
      </div>
    </div>
  );
};

export default DailyLimitModal;