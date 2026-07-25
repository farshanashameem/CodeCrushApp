import {
  Users,
  Baby,
  Gamepad2,
  Trophy,
  Crown,
  IndianRupee,
} from "lucide-react";

import SummaryCard from "./SummaryCard";

const summaryData = [
  {
    title: "Total Parents",
    value: 1245,
    icon: <Users size={24} />,
    iconBg: "from-blue-500 to-cyan-500",
    trend: "+12%",
    trendType: "increase" as const,
  },
  {
    title: "Total Children",
    value: 2184,
    icon: <Baby size={24} />,
    iconBg: "from-cyan-500 to-sky-500",
    trend: "+8%",
    trendType: "increase" as const,
  },
  {
    title: "Games Played",
    value: "15.2K",
    icon: <Gamepad2 size={24} />,
    iconBg: "from-purple-500 to-pink-500",
    trend: "+18%",
    trendType: "increase" as const,
  },
  {
    title: "Levels Completed",
    value: "8.9K",
    icon: <Trophy size={24} />,
    iconBg: "from-amber-500 to-orange-500",
    trend: "+6%",
    trendType: "increase" as const,
  },
  {
    title: "Premium Users",
    value: 320,
    icon: <Crown size={24} />,
    iconBg: "from-violet-500 to-fuchsia-500",
    trend: "+15%",
    trendType: "increase" as const,
  },
  {
    title: "Total Revenue",
    value: "₹48,500",
    icon: <IndianRupee size={24} />,
    iconBg: "from-emerald-500 to-green-500",
    trend: "+10%",
    trendType: "increase" as const,
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {summaryData.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          trend={card.trend}
          trendType={card.trendType}
        />
      ))}
    </div>
  );
}