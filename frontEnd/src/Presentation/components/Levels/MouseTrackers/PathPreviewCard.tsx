interface PathPreviewCardProps {
  pathWidth: number;

  pointCount: number;

  confirmed: boolean;
}

const PathPreviewCard = ({
  pathWidth,
  pointCount,
  confirmed,
}: PathPreviewCardProps) => {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md p-6 shadow-xl">

      <h2 className="font-mochiy text-lg text-indigo-700 mb-5">
        Path Preview
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="rounded-2xl bg-white/40 p-4">
          <p className="text-sm text-slate-500">
            Status
          </p>

          <p
            className={`font-bold mt-2 ${
              confirmed
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {confirmed
              ? "Confirmed"
              : "Not Confirmed"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/40 p-4">
          <p className="text-sm text-slate-500">
            Path Width
          </p>

          <p className="font-bold mt-2 text-indigo-700">
            {pathWidth}px
          </p>
        </div>

        <div className="rounded-2xl bg-white/40 p-4">
          <p className="text-sm text-slate-500">
            Total Points
          </p>

          <p className="font-bold mt-2 text-violet-700">
            {pointCount}
          </p>
        </div>

      </div>

      {!confirmed && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4">

          <p className="text-sm text-amber-700">
            Draw a path and click
            <span className="font-semibold">
              {" "}Confirm Path
            </span>
            {" "}before creating the level.
          </p>

        </div>
      )}

    </div>
  );
};

export default PathPreviewCard;