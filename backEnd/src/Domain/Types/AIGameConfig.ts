import AIGameDifficulty from '../enums/AIGameDifficulty.enum';
import AIGameType from '../enums/AIGameType.enum';

export interface AIGameBaseConfig {
    gameType: AIGameType;
    title: string;
    description: string;
    theme: string;
    difficulty: AIGameDifficulty;
}

export interface AIQuizConfig extends AIGameBaseConfig {
    gameType: AIGameType.QUIZ;
    questionCount: number;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];

    timeLimit: number;
}

export interface AITypingConfig extends AIGameBaseConfig {
    gameType: AIGameType.TYPING;
    wordCount: number;
    words: string[];

    timeLimit: number;
}

export interface AIMemoryConfig extends AIGameBaseConfig {
    gameType: AIGameType.MEMORY;
    pairCount: number;
    cards: {
        id: string;
        content: string;
    }[];
}

export interface AISortingConfig extends AIGameBaseConfig {
    gameType: AIGameType.SORTING;
    categoryCount: number;
    categories: string[];

    items: {
        name: string;
        category: string;
    }[];
}

export interface AICatchConfig extends AIGameBaseConfig {
    gameType: AIGameType.CATCH;
    objectTypeCount: number;
    objects: {
        name: string;
        emoji: string;
        points: number;
    }[];

    duration: number;
}

export type AIGameConfig =
    | AIQuizConfig
    | AITypingConfig
    | AIMemoryConfig
    | AISortingConfig
    | AICatchConfig;