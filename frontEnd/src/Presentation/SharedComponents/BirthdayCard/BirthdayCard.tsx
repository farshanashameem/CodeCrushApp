import BirthdayMessage from "./BirthdayMessage";

import logo from "../../../assets/logo.png";

import flyingRobot from "../../../assets/playingRobo1.png";
import wavingRobot from "../../../assets/playingRobo4.png";
import puzzleRobot from "../../../assets/puzzleRobo.png";

interface Props {
  childName: string;
  age: number;
}

export default function BirthdayCard({ childName, age }: Props) {
  return (
    <>
      <style>{`
            @keyframes robotFloat{
            0%,100%{
                transform:translateY(0);
            }

            50%{
                transform:translateY(-14px);
            }
            }
`}</style>
      <div
        id="birthday-card"
        className="
                relative
                w-full
                max-w-5xl
                overflow-hidden
                rounded-[40px]
                border-[8px]
                border-[10px]
                border-pink-400
                shadow-[0_0_60px_rgba(255,120,180,.45)]
                bg-[linear-gradient(135deg,#FFE45E_0%,#FFD6A5_20%,#FFB3C6_45%,#BDE0FE_70%,#CAFFBF_100%)]
                shadow-[0_25px_80px_rgba(0,0,0,.25)]
            "
      >
        {/* Top Decoration */}
        <div className="absolute -left-12 -top-10 h-48 w-48 rounded-full bg-pink-400/60 blur-[90px]" />

        <div className="absolute right-0 -top-8 h-52 w-52 rounded-full bg-yellow-300/60 blur-[90px]" />

        <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-300/50 blur-[100px]" />

        <div className="absolute bottom-6 right-10 h-36 w-36 rounded-full bg-purple-300/40 blur-[80px]" />
        {/* Logo */}

        <div className=" flex justify-center">
          <img src={logo} alt="Code Crush" className="w-30 select-none" />
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-full bg-gradient-to-r
from-purple-500
via-pink-500
to-orange-400 px-8 py-2 text-sm font-bold tracking-wide text-white shadow-lg">
            🎈 Celebrating One of Our Amazing Explorers! 🎈
          </div>
        </div>

        {/* Flying Robot */}

        <img
          src={flyingRobot}
          className="absolute left-4 top-16 w-24 md:w-32 lg:w-36 animate-[robotFloat_4s_ease-in-out_infinite]"
        />

        {/* Happy Robot */}

        <img
          src={wavingRobot}
          className="absolute right-4 top-20 w-28 md:w-36 lg:w-40 animate-[robotFloat_5s_ease-in-out_infinite]"
        />

        {/* Main */}

        <div
                className="
                mx-8
                mt-8
                rounded-[30px]
                bg-white/40
                backdrop-blur-md
                border-4
                border-white/60
                px-8
                md:px-12
                lg:px-16
                pt-8
                pb-10
                text-center
                shadow-xl
                "
                >
          <h3 className="font-bold tracking-[6px] text-pink-500 uppercase">
            🎉 Today We Celebrate You!
          </h3>

          <h1
            className="
mt-4
text-4xl
md:text-5xl
lg:text-6xl
font-black
text-transparent
bg-gradient-to-r
from-pink-600
via-orange-500
to-yellow-500
bg-clip-text
drop-shadow-lg
"
          >
            🎉 Happy Birthday! 🎉
          </h1>
          <div className="mt-4">
            <span
              className="
rounded-full
bg-gradient-to-r
from-pink-500
via-orange-400
to-yellow-400
px-10
py-3
text-2xl
font-black
text-white
border-4
border-white
shadow-2xl
animate-pulse
"
            >
              {childName}
            </span>
          </div>

          <div className="mt-4 text-xl font-semibold text-slate-600">
            {age} Years Young Today 🎂
          </div>

          <BirthdayMessage childName={childName} />
        </div>

        {/* Bottom Robot */}

        <div
className="
mx-6
mb-6
flex
items-end
justify-between
rounded-[28px]
bg-gradient-to-r
from-pink-200
via-yellow-200
to-cyan-200
px-8
py-6
shadow-xl
"
>
        
         <img
            src={puzzleRobot}
            className="w-15 md:w-20 lg:w-20 animate-[robotFloat_6s_ease-in-out_infinite]"
          />

          <div className="text-center">
            <p className="text-lg font-medium text-slate-600">
              ❤️ From everyone at
            </p>

            <h2 className="text-4xl font-black text-sky-700">Code Crush</h2>

            <p className="mt-2 text-slate-500">
              Keep Learning • Keep Playing • Keep Crushing It!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
