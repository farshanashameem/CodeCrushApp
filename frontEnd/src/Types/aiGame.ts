export type AIGameType =
  | "QUIZ"
  | "TYPING"
  | "MEMORY"
  | "SORTING"
  | "CATCH";

export type AIGameDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

/* ========================================================= */
/* CREATE REQUEST TYPES */
/* ========================================================= */

export interface CreateAIQuizPayload {
  gameType: "QUIZ";
  difficulty: AIGameDifficulty;
  prompt: string;
  questionCount: number;
}

export interface CreateAITypingPayload {
  gameType: "TYPING";
  difficulty: AIGameDifficulty;
  prompt: string;
  wordCount: number;
}

export interface CreateAIMemoryPayload {
  gameType: "MEMORY";
  difficulty: AIGameDifficulty;
  prompt: string;
  pairCount: number;
}

export interface CreateAISortingPayload {
  gameType: "SORTING";
  difficulty: AIGameDifficulty;
  prompt: string;
  categoryCount: number;
}

export interface CreateAICatchPayload {
  gameType: "CATCH";
  difficulty: AIGameDifficulty;
  prompt: string;
  objectTypeCount: number;
}

export type CreateAIGamePayload =
  | CreateAIQuizPayload
  | CreateAITypingPayload
  | CreateAIMemoryPayload
  | CreateAISortingPayload
  | CreateAICatchPayload;


/* ========================================================= */
/* GENERATED GAME RESPONSE TYPES */
/* ========================================================= */

export interface AIGameBaseConfig {
  gameType: AIGameType;
  title: string;
  description: string;
  theme: string;
  difficulty: AIGameDifficulty;
}


/* ========================================================= */
/* QUIZ */
/* ========================================================= */

export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AIQuizGame extends AIGameBaseConfig {
  gameType: "QUIZ";
  questionCount: number;
  questions: AIQuizQuestion[];
  timeLimit: number;
}


/* ========================================================= */
/* TYPING */
/* ========================================================= */

export interface AITypingGame extends AIGameBaseConfig {
  gameType: "TYPING";
  wordCount: number;
  words: string[];
  timeLimit: number;
}


/* ========================================================= */
/* MEMORY */
/* ========================================================= */

export interface AIMemoryCard {
  id: number;
  content: string;
}

export interface AIMemoryGame extends AIGameBaseConfig {
  gameType: "MEMORY";
  pairCount: number;
  cards: AIMemoryCard[];
}


/* ========================================================= */
/* SORTING */
/* ========================================================= */

export interface AISortingItem {
  name: string;
  category: string;
}

export interface AISortingGame extends AIGameBaseConfig {
  gameType: "SORTING";
  categoryCount: number;
  categories: string[];
  items: AISortingItem[];
}


/* ========================================================= */
/* CATCH */
/* ========================================================= */

export interface AICatchObject {
  name: string;
  emoji: string;
  count: number;
}

export interface AICatchGame extends AIGameBaseConfig {
  gameType: "CATCH";
  objectTypeCount: number;
  objects: AICatchObject[];
  duration: number;
}


/* ========================================================= */
/* GENERATED AI GAME UNION */
/* ========================================================= */

export type AIGameConfig =
  | AIQuizGame
  | AITypingGame
  | AIMemoryGame
  | AISortingGame
  | AICatchGame;