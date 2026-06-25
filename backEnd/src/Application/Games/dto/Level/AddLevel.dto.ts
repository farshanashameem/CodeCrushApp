import { ColorSorterConfig, MouseTrackerConfig, PicturePuzzleConfig, TypingConfig } from "../../../../Domain/Types/Config";

export interface AddLevelInputDTO {

    gameId: string;
    levelNumber: number;
    difficulty: "easy" | "medium" | "hard";
    timer: number;
    maxScore: number;
    config: ColorSorterConfig | MouseTrackerConfig | PicturePuzzleConfig | TypingConfig;

}

export interface AddLevelOutputDTO {
    success: boolean;
    message: string;
}