interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

// Generate random star properties outside the React component.
// This keeps the component pure and avoids React 19's
// "Cannot call impure function during render" error.
const stars: Star[] = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 4 + Math.random() * 8,
  duration: 1.5 + Math.random() * 2,
  delay: Math.random() * 3,
}));

export default function FloatingStars() {
  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% {
              opacity: 0.2;
              transform: scale(0.6) rotate(0deg);
            }

            50% {
              opacity: 1;
              transform: scale(1.4) rotate(180deg);
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute flex items-center justify-center text-yellow-300"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `-${star.delay}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>
    </>
  );
}