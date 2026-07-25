import type { RevenueMetrics as RevenueMetricsType } from "../../../../../../Types/reports";

interface RevenueMetricsProps {
  metrics?: RevenueMetricsType;
}

export default function RevenueMetrics({
  metrics,
}: RevenueMetricsProps) {
const cards = [
  {
    title: "Total Revenue",
    value: `₹${Math.round(metrics?.totalRevenue ?? 0)}`,
    icon: "💰",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    title: "Total Purchases",
    value: metrics?.totalPurchases ?? 0,
    icon: "💳",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    title: "Premium Subscribers",
    value: metrics?.premiumSubscribers ?? 0,
    icon: "👑",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    title: "Average Purchase",
    value: `₹${Math.round(metrics?.averagePurchaseValue ?? 0)}`,
    icon: "📈",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${card.bg}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">
                {card.value}
              </h3>
            </div>

            <div className={`text-3xl ${card.text}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}