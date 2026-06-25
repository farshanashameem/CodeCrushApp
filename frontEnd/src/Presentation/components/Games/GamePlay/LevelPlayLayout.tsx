import ChildLayout from "../../Child/ChildLayout";
import FailureModal from "./FailureModal";
import GameHUD from "./GameHUD";
import SuccessModal from "./SuccessModal";

const LevelPlayLayout = ({
  theme,
  child,
  gameName,
  score,
  timer,
  stars,
  children,
  timerComponent,
  success,
  failure,
  onRetry,
  onNext,
  onBack,
}: any) => {
  return (
    <ChildLayout
      background={theme.background}
      child={child}
      coins={child?.coins || 0}
      logo={theme.logo}
      title={gameName}
    >
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-10">

        <GameHUD score={score} timer={timer} stars={stars}>
          {timerComponent}
        </GameHUD>

        {/* GAME AREA */}
        {children}

        {/* SUCCESS */}
        <SuccessModal
          open={success}
          gameName={gameName}
          score={score}
          stars={stars}
          timeTaken={0}
          onRetry={onRetry}
          onNext={onNext}
        />

        {/* FAILURE */}
        <FailureModal
          open={failure}
          gameName={gameName}
          reason="⏰ Time Up"
          score={score}
          stars={stars}
          timeTaken={0}
          onRetry={onRetry}
          onBack={onBack}
        />
      </div>
    </ChildLayout>
  );
};

export default LevelPlayLayout;