const colors = [
  "bg-pink-400",
  "bg-yellow-300",
  "bg-sky-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-red-400",
];

interface Balloon {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

// Generate random balloon properties outside the React component.
// This keeps the component pure and satisfies React 19's purity rules.
const balloons: Balloon[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 50 + Math.random() * 35,
  duration: 12 + Math.random() * 8,
  delay: Math.random() * 10,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

export default function FloatingBalloons() {
  return (
    <>
      <style>
        {`
          @keyframes floatBalloon {
            from {
              transform: translateY(120vh);
            }

            to {
              transform: translateY(-140vh);
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="absolute"
            style={{
              left: `${balloon.left}%`,
              animation: `floatBalloon ${balloon.duration}s linear infinite`,
              animationDelay: `-${balloon.delay}s`,
            }}
          >
            <div
              className={`${balloon.color} relative rounded-full shadow-xl`}
              style={{
                width: balloon.size,
                height: balloon.size * 1.2,
              }}
            >
              <div className="absolute left-1/2 top-full h-20 w-[2px] -translate-x-1/2 bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
