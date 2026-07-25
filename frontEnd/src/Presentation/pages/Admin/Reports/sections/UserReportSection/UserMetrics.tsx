import {
  UserCheck,
  UserPlus,
  UserRound,
  UserX,
  Crown,
  Users,
} from "lucide-react";

import ReportMetricCard from "../../components/ReportMetricCard";
import type { UserReportMetrics } from "../../../../../../Types/reports";

interface UserMetricsProps {
  metrics?: UserReportMetrics;
}
export default function UserMetrics({
  metrics,
}: UserMetricsProps) {
  const reportMetrics = [
  {
    title: "Total Parents",
    value: metrics?.totalParents ?? 0,
    icon: <Users size={20} />,
    iconBg: "from-blue-500 to-cyan-500",
  },
  {
    title: "Active Users",
    value: metrics?.activeParents ?? 0,
    icon: <UserCheck size={20} />,
    iconBg: "from-emerald-500 to-green-500",
  },
  {
    title: "New Registrations",
    value: metrics?.newRegistrations ?? 0,
    icon: <UserPlus size={20} />,
    iconBg: "from-purple-500 to-pink-500",
  },
  {
    title: "Blocked Users",
    value: metrics?.blockedParents ?? 0,
    icon: <UserX size={20} />,
    iconBg: "from-red-500 to-rose-500",
  },
  {
    title: "Premium Users",
    value: metrics?.premiumParents ?? 0,
    icon: <Crown size={20} />,
    iconBg: "from-amber-500 to-orange-500",
  },
  {
    title: "Free Users",
    value: metrics?.freeParents ?? 0,
    icon: <UserRound size={20} />,
    iconBg: "from-slate-500 to-slate-700",
  },
];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {reportMetrics.map((metric) => (
        <ReportMetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          iconBg={metric.iconBg}
        />
      ))}
    </div>
  );
}