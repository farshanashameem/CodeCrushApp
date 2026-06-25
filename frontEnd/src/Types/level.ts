// types/level.ts

import type { CreateColorSorterLevelPayload } from "./colourSorter";
import type { CreateMouseTrackerLevelPayload } from "./mouseTracker";
import type { CreatePicturePuzzleLevelPayload } from "./picturePuzzle";
import type { CreateTypingLevelPayload } from "./typing";

export interface MouseTrackerConfig {
  pathWidth: number;

  pathCoordinates: {
    x: number;
    y: number;
  }[];
}

export interface ColorSorterConfig {
  targetColors: string[];

  items: {
    iconId: string;
    color: string;
    count: number;
  }[];
}

export interface TypingConfig {
  words: string[];
}

export interface PicturePuzzleStep {
  imageId: string;
  answer: string;
}

export interface PicturePuzzleConfig {
  steps: PicturePuzzleStep[];
}

export interface PicturePuzzleStepForm {
  imageId: string;
  imageName: string;
  imageUrl: string;
  answer: string;
}

export type LevelConfig =
  | MouseTrackerConfig
  | ColorSorterConfig
  | TypingConfig
  | PicturePuzzleConfig;

export interface Level {
  id: string;
  gameId: string;
  levelNumber: number;
  difficulty: "easy" | "medium" | "hard";
  timer: number;
  maxScore: number;
  config: LevelConfig;
  isActive: boolean;
}

export interface CreateLevelPayload {
  gameId: string;

  levelNumber: number;

  difficulty: "easy" | "medium" | "hard";

  timer: number;

  maxScore: number;

  config:
    | CreatePicturePuzzleLevelPayload["config"]
    | CreateColorSorterLevelPayload["config"]
    | CreateTypingLevelPayload["config"]
    | CreateMouseTrackerLevelPayload["config"]
}

export interface UpdateLevelPayload {
  difficulty?: "easy" | "medium" | "hard";
  timer?: number;
  maxScore?: number;
  config?: LevelConfig;
  isActive?: boolean;
}