export interface CreateTypingLevelPayload {
  gameId: string;

  levelNumber: number;

  difficulty: "easy" | "medium" | "hard";

  timer: number;

  maxScore: number;

  config: {
    words: string[];
  };
}