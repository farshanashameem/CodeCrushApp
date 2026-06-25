import mouseBg from "../assets/level-backgrounds/mouse-bg.png";
import typingBg from "../assets/level-backgrounds/typing-bg.png";
import colorBg from "../assets/level-backgrounds/color-bg.png";
import puzzleBg from "../assets/level-backgrounds/puzzle-bg.png";

import mouseLogo from "../assets/game-logos/mouse-logo.png";
import typingLogo from "../assets/game-logos/typing-logo.png";
import colorLogo from "../assets/game-logos/color-logo.png";
import puzzleLogo from "../assets/game-logos/puzzle-logo.png";


import mouseSuccessImg from "../assets/games/mt-success.png"
import mouseFailureImg from "../assets/games/cc-failure.png"
import typingSuccessImg from "../assets/games/tt-success.png"
import typingFailureImg from "../assets/games/tt-failure.png"
import colorSuccessImg from "../assets/games/cc-success.png"
import colorFailureImg from "../assets/games/cc-failure.png"
import puzzleSuccessImg from "../assets/games/pp-success.png"
import puzzleFailureImg from "../assets/games/pp-failure.png"

export const gameTheme = {
  "Mouse Trackers": {
    background: mouseBg,
    logo: mouseLogo,
    successBackground: mouseSuccessImg,
    failureBackground: mouseFailureImg,
  },

  "Typing Titans": {
    background: typingBg,
    logo: typingLogo,
    successBackground: typingSuccessImg,
    failureBackground: typingFailureImg,
  },

  "Colour Sorter Safari": {
    background: colorBg,
    logo: colorLogo,
    successBackground: colorSuccessImg,
    failureBackground: colorFailureImg,
  },

  "Picture Puzzlers": {
    background: puzzleBg,
    logo: puzzleLogo,
    successBackground: puzzleSuccessImg,
    failureBackground: puzzleFailureImg,
  },
};