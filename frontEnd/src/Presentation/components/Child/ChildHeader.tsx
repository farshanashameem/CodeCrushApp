import { avatarMap } from "../../../Constants/avatarMap";

interface ChildHeaderProps {
  child?: {
    name: string;
    avatar: string;
    age?: number;
  } | null;
  coins?: number;
  logo?: string;

  title?: string;
}

const ChildHeader = ({ child, coins = 0, logo, title }: ChildHeaderProps) => {
  return (
    <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-white/30 backdrop-blur-md border-b border-white/30">
      {/* Left Logo */}
      <div className="flex items-center gap-4">
        {logo && (
          <img
            src={logo}
            alt="game-logo"
            className="w-14 h-14 md:w-16 md:h-16 object-contain"
          />
        )}

        <div>
          <h1 className="font-mochiy text-2xl md:text-4xl text-indigo-600">
            {title || "🌈 Skill Quest"}
          </h1>

          <p className="text-xs text-indigo-500 font-bold mt-1">
            Learn • Play • Grow
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Coins */}
        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full shadow-lg">
          <span className="text-xl">🪙</span>

          <span className="font-mochiy text-white text-sm">{coins}</span>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-lg border-2 border-indigo-200">
          <img
            src={avatarMap[child?.avatar as keyof typeof avatarMap]}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="hidden sm:block">
            <p className="font-mochiy text-sm text-slate-700">{child?.name}</p>

            <p className="text-xs text-slate-500">Age {child?.age}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChildHeader;
