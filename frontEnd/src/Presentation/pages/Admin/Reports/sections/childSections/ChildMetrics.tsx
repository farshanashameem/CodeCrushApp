import {
  Users,
  UserCheck,
  Clock3,
  Trophy,
  GraduationCap,
} from "lucide-react";
import ReportMetricCard from "../../components/ReportMetricCard";
import type { ChildReportMetrics } from "../../../../../../Types/reports";
import { formatTime } from "../../../../../../Utils/formatTime";

interface ChildMetricsProps {
  metrics?: ChildReportMetrics;
}

export default function ChildMetrics({ metrics, }: ChildMetricsProps) {

  const cards = [
    {
      title: "Total Children",
      value: metrics?.totalChildren ?? 0,
      icon: <Users size={20} />,
      iconBg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Children",
      value: metrics?.activeChildren ?? 0,
      icon: <UserCheck size={20} />,
      iconBg: "from-emerald-500 to-green-500",
    },
    {
      title: "Average Best Time",
      value: formatTime(Math.round(metrics?.averageBestTime ?? 0)),
      icon: <Clock3 size={20} />,
      iconBg: "from-orange-500 to-amber-500",
    },
    {
      title: "Average Score",
      value: Math.round(metrics?.averageScore ?? 0),
      icon: <Trophy size={20} />,
      iconBg: "from-purple-500 to-pink-500",
    },
    {
      title: "Avg. Completed Levels",
      value: Number(
        (metrics?.averageCompletedLevels ?? 0).toFixed(1)
      ),
      icon: <GraduationCap size={20} />,
      iconBg: "from-indigo-500 to-violet-500",
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