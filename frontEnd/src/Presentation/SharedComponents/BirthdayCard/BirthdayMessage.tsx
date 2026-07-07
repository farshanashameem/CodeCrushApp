interface BirthdayMessageProps {
  childName: string;
}

export default function BirthdayMessage({
  childName,
}: BirthdayMessageProps) {
  return (
    <div className="mx-auto mt-2 max-w-3xl rounded-3xl border-2 border-yellow-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
      <h2 className="mb-6 text-3xl font-black text-pink-500">
        🎂 A Special Wish Just for You!
      </h2>

      <div className="space-y-3 text-base md:text-lg leading- text-slate-700">
        <p>
          Dear{" "}
          <span className="font-bold text-sky-600">
            {childName}
          </span>
          ,
        </p>

        <p>
          🎉 Today is all about celebrating{" "}
          <span className="font-semibold text-pink-500">
            YOU
          </span>
          !
        </p>

        <p>
          May your day be filled with{" "}
          <span className="font-semibold text-yellow-500">
            laughter
          </span>
          ,{" "}
          <span className="font-semibold text-green-500">
            fun
          </span>
          , exciting{" "}
          <span className="font-semibold text-purple-500">
            adventures
          </span>
          , and lots of happy memories.
        </p>

        <p>
          Keep exploring, solving puzzles, learning new skills,
          and becoming an even more amazing young creator every day.
        </p>

        <p>
          Remember...
        </p>

        <div className="rounded-2xl bg-gradient-to-r from-sky-100 via-cyan-50 to-sky-100 p-6 text-center shadow-inner">
          <p className="text-2xl font-bold text-sky-700">
            🌟 Dream Big.
          </p>

          <p className="text-2xl font-bold text-pink-600">
            🎮 Play Joyfully.
          </p>

          <p className="text-2xl font-bold text-green-600">
            🚀 Keep Learning.
          </p>

          <p className="text-2xl font-bold text-yellow-500">
            💙 Keep Crushing It!
          </p>
        </div>

        <p className="pt-4 text-xl font-semibold text-slate-800">
          We're so happy you're part of the
          <span className="ml-2 text-sky-600">
            Code Crush Family!
          </span>
        </p>

        <p className="text-2xl font-black text-pink-500">
          Happy Birthday! 🎈🎂🎉
        </p>
      </div>
    </div>
  );
}