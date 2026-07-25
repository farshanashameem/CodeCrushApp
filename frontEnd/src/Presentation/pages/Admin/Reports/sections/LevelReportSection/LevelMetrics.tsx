import type { LevelReportMetrics } from "../../../../../../Types/reports";

interface LevelMetricsProps {
  metrics?: LevelReportMetrics;
}

export default function LevelMetrics({
  metrics,
}: LevelMetricsProps) {
  const cards = [
    {
      title: "Total Levels",
      value: metrics?.totalLevels ?? 0,
      icon: "🎯",
      bg: "from-blue-500/10 to-blue-600/5",
      text: "text-blue-600",
    },
    {
      title: "Total Attempts",
      value: metrics?.totalAttempts ?? 0,
      icon: "🎮",
      bg: "from-amber-500/10 to-amber-600/5",
      text: "text-amber-600",
    },
    {
      title: "Completions",
      value: metrics?.totalCompletions ?? 0,
      icon: "✅",
      bg: "from-emerald-500/10 to-emerald-600/5",
      text: "text-emerald-600",
    },
    {
      title: "Success Rate",
      value: `${Math.round(metrics?.averageSuccessRate ?? 0)}%`,
      icon: "📈",
      bg: "from-violet-500/10 to-violet-600/5",
      text: "text-violet-600",
    },
    {
      title: "Average Score",
      value: Math.round(metrics?.averageScore ?? 0),
      icon: "⭐",
      bg: "from-rose-500/10 to-rose-600/5",
      text: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-2xl bg-gradient-to-br ${card.bg} border border-white/30 p-5 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-800">
                {card.value}
              </h3>
            </div>

            <div
              className={`text-3xl ${card.text}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}