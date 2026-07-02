import ProgressEntity from '@/Domain/Entities/Progress.entity';

export interface SubmitLevelDTO {
  childId: string;
  gameId: string;
  levelId: string;
  levelNumber: number;
  completed: boolean;
  score: number;
  stars: number; 
  timeTaken: number;
  mistakes: number;
}

export interface SubmitLevelOutputDTO {
  progress: ProgressEntity
}