import AdminDashboardLayout from "../../../layouts/AdminDashboardLayout";
import AdminReports from "./AdminReports";

const ReportsPage = () => {
  const cards = [
    { title: "Users", value: 1200, icon: "👨‍👩‍👧", color: "text-blue-600" },
    { title: "Children", value: 500, icon: "🧒", color: "text-cyan-600" },
    { title: "Games", value: 4, icon: "🎮", color: "text-violet-600" },
    { title: "Levels", value: 40, icon: "⭐", color: "text-amber-500" },
    { title: "Stars Earned", value: "8,540", icon: "🏆", color: "text-yellow-500" },
    { title: "Play Time", value: "126h", icon: "⏱", color: "text-emerald-600" },
  ];

  return (
    <AdminDashboardLayout pageTitle="Reports Dashboard 📊">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-violet-900">
            Reports Dashboard 📊
          </h1>
          <p className="text-slate-700 text-xs md:text-sm mt-1 font-medium">
            Platform statistics and analytics
          </p>
        </div>

        {/* Overview Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/85 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/40 shadow-md hover:-translate-y-1 transition duration-200"
            >
              <div className="flex justify-between items-center">
                <p className="text-[10px] md:text-xs uppercase font-bold text-slate-500 tracking-wider">
                  {card.title}
                </p>
                <span className="text-xl md:text-2xl">{card.icon}</span>
              </div>
              <h2 className={`mt-2 md:mt-3 text-2xl md:text-3xl font-black ${card.color}`}>
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Embedded Sub-Section Components */}
        <AdminReports />
      </div>
    </AdminDashboardLayout>
  );
};

export default ReportsPage;