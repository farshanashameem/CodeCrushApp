export interface CreatePicturePuzzleLevelPayload {
  gameId: string;
    levelNumber: number,
  difficulty: "easy" | "medium" | "hard";

  timer: number;

  maxScore: number;

  config: {
    steps: {
      imageId: string;
      answer: string;
    }[];
  };
}