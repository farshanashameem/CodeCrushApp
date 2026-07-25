import {
  Gamepad2,
  Layers3,
  PlayCircle,
  Trophy,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import type { GameReportMetrics } from "../../../../../../Types/reports";
import ReportMetricCard from "../../components/ReportMetricCard";

interface GameMetricsProps {
  metrics?: GameReportMetrics;
}

export default function GameMetrics({
  metrics,
}: GameMetricsProps) {
  const cards = [
    {
      title: "Total Games",
      value: metrics?.totalGames ?? 0,
      icon: <Gamepad2 size={20} />,
      iconBg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Levels",
      value: metrics?.totalLevels ?? 0,
      icon: <Layers3 size={20} />,
      iconBg: "from-purple-500 to-violet-500",
    },
    {
      title: "Total Plays",
      value: metrics?.totalPlays ?? 0,
      icon: <PlayCircle size={20} />,
      iconBg: "from-emerald-500 to-green-500",
    },
    {
      title: "Average Score",
      value: Math.round(metrics?.averageScore ?? 0),
      icon: <Trophy size={20} />,
      iconBg: "from-orange-500 to-amber-500",
    },
    {
      title: "Completion Rate",
      value: `${Math.round(metrics?.averageCompletionRate ?? 0)}%`,
      icon: <CheckCircle2 size={20} />,
      iconBg: "from-pink-500 to-rose-500",
    },
    {
      title: "Average Attempts",
      value: Number(
        (metrics?.averageAttempts ?? 0).toFixed(1)
      ),
      icon: <RotateCcw size={20} />,
      iconBg: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <ReportMetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
        />
      ))}
    </div>
  );
}