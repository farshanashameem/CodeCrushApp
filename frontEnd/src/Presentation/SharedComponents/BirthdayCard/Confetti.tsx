import { useMemo } from "react";

const colors = [
  "#FF4D6D",
  "#FFD60A",
  "#38BDF8",
  "#4ADE80",
  "#A855F7",
  "#FB923C",
  "#F472B6",
];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  color: string;
  circle: boolean;
}

export default function Confetti() {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 8 + Math.random() * 8,
        rotate: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        circle: Math.random() > 0.5,
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes confettiFall{
          0%{
            transform:translateY(-120px) rotate(0deg);
            opacity:1;
          }

          100%{
            transform:translateY(120vh) rotate(720deg);
            opacity:.9;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.left}%`,
              animation: `confettiFall ${piece.duration}s linear infinite`,
              animationDelay: `-${piece.delay}s`,
            }}
          >
            <div
              style={{
                width: piece.size,
                height: piece.circle ? piece.size : piece.size * 0.5,
                borderRadius: piece.circle ? "999px" : "2px",
                background: piece.color,
                transform: `rotate(${piece.rotate}deg)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}