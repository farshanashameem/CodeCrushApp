import { useNavigate } from "react-router-dom";

import BGVideo from "../../../assets/home-bg.mp4";
import Logo from "../../../assets/logo.png";
import Kid1 from "../../../assets/boy1.png";
import Kid2 from "../../../assets/girl1.png";
import Kid3 from "../../../assets/boy2.png";
import Kid4 from "../../../assets/boy3.png";
import Start from "../../../assets/start.png";
import Begin from "../../../assets/Begin.png";

const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/parent/auth");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 1. BACKGROUND LAYER: The "Blurred Filler" */}
      {/* This fills the entire screen so there are no empty gaps */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-95 z-0"
      >
        <source src={BGVideo} type="video/mp4" />
      </video>

      {/* 2. FOREGROUND LAYER: The "Main Video" */}
      {/* This shows the video without cropping it (object-contain) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain z-10"
      >
        <source src={BGVideo} type="video/mp4" />
      </video>

      {/* 3. OVERLAY: Slight dark tint to make buttons pop */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* 4. LOGO: Centered at the top */}
      <div className="absolute top-6 left-0 w-full flex justify-center z-50">
        <img
          src={Logo}
          alt="Logo"
          className="w-[100px] sm:w-[160px] md:w-[220px]"
        />
      </div>

      {/* 5. DECORATIVE KIDS: Pinned to screen corners */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <img
          src={Kid1}
          className="hidden lg:block absolute left-[5%] top-[40%] w-[150px] xl:w-[220px]"
        />
        <img
          src={Kid2}
          className="hidden lg:block absolute right-[5%] top-[30%] w-[150px] xl:w-[220px]"
        />
        <img
          src={Kid3}
          className="hidden lg:block absolute right-[10%] bottom-[10%] w-[150px] xl:w-[220px]"
        />
        <img
          src={Kid4}
          className="hidden lg:block absolute left-[10%] bottom-[8%] w-[150px] xl:w-[220px]"
        />
      </div>

      {/* Hero Content - Forces the container to be the size of the screen */}
     <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pt-24 md:pt-32 z-40">
        {/* Start Image */}
        <img
          src={Start}
          alt="Start"
          className="w-[220px] sm:w-[320px] md:w-[380px] lg:w-[400px]"
        />

        {/* Begin Button */}
        <img
          src={Begin}
          alt="Begin"
          onClick={handleStart}
          className="mt-8 cursor-pointer transition-transform hover:scale-110 active:scale-95 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px]"
        />
      </div>
    </div>
  );
};

export default HomePage;
