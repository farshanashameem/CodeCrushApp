import { useRef, useState } from "react";

export interface PathPoint {
  x: number;
  y: number;
}

interface PathDrawingCanvasProps {
  pathWidth: number;
  pathCoordinates?: PathPoint[];
  isEditing?: boolean;
  onConfirm: (coordinates: PathPoint[]) => void;
  onRetry: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const PathDrawingCanvas = ({
  pathWidth,
  pathCoordinates = [],
  isEditing = true,
  onConfirm,
  onRetry,
}: PathDrawingCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const drawingRef = useRef(false);

  const [pathPoints, setPathPoints] = useState<PathPoint[]>(pathCoordinates);

  const [confirmed, setConfirmed] = useState(false);

  const getMousePosition = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();

    if (!rect) {
      return {
        x: 0,
        y: 0,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const normalizePoint = (x: number, y: number): PathPoint => {
    const rect = svgRef.current?.getBoundingClientRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: Number((x / rect.width).toFixed(4)),
      y: Number((y / rect.height).toFixed(4)),
    };
  };

  const getDistance = (first: PathPoint, second: PathPoint) => {
    const dx = first.x - second.x;

    const dy = first.y - second.y;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditing) return;
    if (confirmed) return;

    drawingRef.current = true;

    const position = getMousePosition(event);

    setPathPoints([normalizePoint(position.x, position.y)]);
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!drawingRef.current || confirmed) {
      return;
    }

    const position = getMousePosition(event);

    const normalized = normalizePoint(position.x, position.y);

    setPathPoints((previous) => {
      if (!previous.length) {
        return [normalized];
      }

      const lastPoint = previous[previous.length - 1];

      const pixelDistance = getDistance(
        {
          x: lastPoint.x * CANVAS_WIDTH,
          y: lastPoint.y * CANVAS_HEIGHT,
        },
        {
          x: position.x,
          y: position.y,
        },
      );

      if (pixelDistance < 5) {
        return previous;
      }

      return [...previous, normalized];
    });
  };

  const handleMouseUp = () => {
    drawingRef.current = false;
  };

  const handleRetry = () => {
    setPathPoints([]);

    setConfirmed(false);
    onRetry();
  };

  const handleConfirm = () => {
    if (pathPoints.length < 2) {
      return;
    }

    setConfirmed(true);

    onConfirm(pathPoints);
  };

  const polylinePoints = pathPoints
    .map((point) => `${point.x * CANVAS_WIDTH},${point.y * CANVAS_HEIGHT}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md">
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="bg-slate-50 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {pathPoints.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={pathWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Points Collected:
          <span className="font-bold ml-2 text-indigo-700">
            {pathPoints.length}
          </span>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2 rounded-xl bg-rose-500 text-white"
            >
              Retry
            </button>

            <button
              type="button"
              disabled={pathPoints.length < 2 || confirmed}
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              {confirmed ? "Confirmed" : "Confirm Path"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathDrawingCanvas;
