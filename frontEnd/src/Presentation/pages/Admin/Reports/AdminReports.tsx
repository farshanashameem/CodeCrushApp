export default function AdminReports() {
  const reports = [
    { title: "Sessions", value: "9,842", icon: "📈", color: "text-emerald-600" },
    { title: "Avg Score", value: "82%", icon: "🏆", color: "text-pink-600" },
  ];

  const reportCards = [
    {
      title: "Children Report",
      icon: "🧒",
      desc: "Registered children, age groups, active players",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Games Report",
      icon: "🎮",
      desc: "Most played games and completion rate",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      title: "Levels Report",
      icon: "⭐",
      desc: "Level completion and difficulty analysis",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Performance Report",
      icon: "🏆",
      desc: "Scores, stars and child progress",
      color: "from-emerald-500 to-green-500",
    },
  ];

  const history = [
    {
      name: "Children Report",
      date: "Today, 10:30 AM",
      by: "Super Admin",
      status: "Ready",
    },
    {
      name: "Games Report",
      date: "Yesterday",
      by: "Super Admin",
      status: "Ready",
    },
    {
      name: "Performance Report",
      date: "2 Days Ago",
      by: "Super Admin",
      status: "Ready",
    },
  ];

  return (
    <div className="mt-8 space-y-8 w-full">
      
      {/* Supplementary Analytics KPIs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/40 p-4 md:p-5 shadow-md hover:-translate-y-1 transition duration-200"
          >
            <div className="flex justify-between">
              <p className="text-[10px] md:text-xs uppercase font-bold text-slate-500 tracking-wider">
                {report.title}
              </p>
              <span className="text-xl md:text-2xl">{report.icon}</span>
            </div>
            <h2 className={`text-2xl md:text-3xl font-black mt-2 md:mt-3 ${report.color}`}>
              {report.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Available Downloads Deck */}
      <div>
        <h2 className="text-lg md:text-xl font-black text-violet-900 mb-4 tracking-wide">
          📂 Available Download Profiles
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {reportCards.map((report) => (
            <div
              key={report.title}
              className="bg-white/90 rounded-2xl border border-white/40 shadow-md overflow-hidden hover:-translate-y-1 transition duration-200"
            >
              <div className={`bg-gradient-to-r ${report.color} p-4 text-white`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-black tracking-wide">{report.title}</h3>
                  <span className="text-2xl md:text-3xl">{report.icon}</span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{report.desc}</p>
                <div className="flex gap-3 mt-4 md:mt-5">
                  <button className="flex-1 rounded-xl bg-violet-600 py-2 text-white text-xs font-bold hover:bg-violet-700 transition active:scale-95">
                    View
                  </button>
                  <button className="flex-1 rounded-xl bg-emerald-600 py-2 text-white text-xs font-bold hover:bg-emerald-700 transition active:scale-95">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Actions / Date Filter Tool-strip */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/40 p-4 md:p-5 shadow-md">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
              Report Target
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-violet-500">
              <option>All Reports</option>
              <option>Children</option>
              <option>Games</option>
              <option>Levels</option>
              <option>Performance</option>
            </select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
              From Date
            </label>
            <input type="date" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-violet-500" />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
              To Date
            </label>
            <input type="date" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-violet-500" />
          </div>

          <button className="w-full sm:w-auto rounded-xl bg-violet-600 px-6 py-2 text-xs font-bold text-white hover:bg-violet-700 transition active:scale-95 shadow-sm">
            Generate
          </button>
        </div>
      </div>

      {/* Historical Generation Logs Ledger */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/40 p-4 md:p-5 shadow-md">
        <h2 className="text-lg md:text-xl font-black text-violet-900 mb-4 tracking-wide">
          📄 Recent Query Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="text-left py-3 pl-2">Report Profile</th>
                <th className="text-left">Generated Time</th>
                <th className="text-left">Requested By</th>
                <th className="text-left">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 font-medium">
              {history.map((item) => (
                <tr key={item.name} className="border-b border-slate-50/50 last:border-0 hover:bg-slate-50/40">
                  <td className="py-3.5 pl-2 font-bold text-slate-800">{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.by}</td>
                  <td>
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 tracking-wide">
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-violet-700 transition active:scale-95 shadow-sm">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}