type ContestTab = "active" | "mine" | "ranking";

interface ContestTabsProps {
  activeTab: ContestTab;
  onTabChange: (tab: ContestTab) => void;
}

interface ContestTabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const ContestTabButton = ({
  active,
  onClick,
  icon,
  label,
}: ContestTabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl border-4 font-bold transition-all flex items-center gap-2 ${
        active
          ? "bg-indigo-600 text-white border-indigo-700 shadow-[0_5px_0_#4338ca] -translate-y-1"
          : "bg-white text-indigo-600 border-indigo-200 shadow-[0_5px_0_#c7d2fe] hover:-translate-y-1"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
};

const ContestTabs = ({
  activeTab,
  onTabChange,
}: ContestTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <ContestTabButton
        active={activeTab === "active"}
        onClick={() => onTabChange("active")}
        icon="🔥"
        label="Active Contests"
      />

      <ContestTabButton
        active={activeTab === "mine"}
        onClick={() => onTabChange("mine")}
        icon="🎮"
        label="My Contests"
      />

      <ContestTabButton
        active={activeTab === "ranking"}
        onClick={() => onTabChange("ranking")}
        icon="📊"
        label="My Ranking"
      />
    </div>
  );
};

export default ContestTabs;