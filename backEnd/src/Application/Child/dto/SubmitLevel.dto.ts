import ProgressEntity from "@/Domain/Entities/Progress.entity";

export interface SubmitLevelDTO {
  childId: string;
  gameId: string;
  levelId: string;
  levelNumber: number;
  score: number;
  stars: number;
  completed: boolean;
  timeTaken: number;
  mistakes: number;
}

export interface SubmitLevelOutputDTO {
  progress: ProgressEntity
}