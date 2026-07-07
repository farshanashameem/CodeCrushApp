interface StatusActionButtonsProps {
  status: string;
  onBlockToggle: () => void;
  onDeleteToggle: () => void;
}

const StatusActionButtons = ({
  status,
  onBlockToggle,
  onDeleteToggle,
}: StatusActionButtonsProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBlockToggle}
        className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
          status === "BLOCKED"
            ? "text-emerald-600 hover:bg-emerald-50"
            : "text-rose-600 hover:bg-rose-50"
        }`}
      >
        {status === "BLOCKED" ? "Unblock" : "Block"}
      </button>

      <button
        onClick={onDeleteToggle}
        className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
          status === "DELETED"
            ? "text-blue-600 hover:bg-blue-50"
            : "text-amber-600 hover:bg-amber-50"
        }`}
      >
        {status === "DELETED" ? "Restore" : "Delete"}
      </button>
    </div>
  );
};

export default StatusActionButtons;