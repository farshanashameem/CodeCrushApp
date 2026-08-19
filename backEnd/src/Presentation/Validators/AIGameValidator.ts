import { z } from 'zod';
import AIGameDifficulty from '@/Domain/enums/AIGameDifficulty.enum';
import AIGameType from '@/Domain/enums/AIGameType.enum';

const aiGameDifficultySchema = z.enum(
    Object.values(AIGameDifficulty) as [
        AIGameDifficulty,
        ...AIGameDifficulty[]
    ]
);


const promptSchema = z
    .string()
    .trim()
    .min(1, 'Game topic is required')
    .max(200, 'Game topic must not exceed 200 characters');


// 🎯 QUIZ

export const createAIQuizSchema = z.object({
    gameType: z.literal(AIGameType.QUIZ),

    difficulty: aiGameDifficultySchema,

    questionCount: z
    .number()
    .int()
    .min(5, 'At least 5 questions are required')
    .max(15, 'Maximum 15 questions are allowed'),

    prompt: promptSchema,
});


// ⌨️ TYPING

export const createAITypingSchema = z.object({
    gameType: z.literal(AIGameType.TYPING),

    difficulty: aiGameDifficultySchema,

    wordCount: z
    .number()
    .int()
    .min(5, 'At least 5 words are required')
    .max(15, 'Maximum 15 words are allowed'),

    prompt: promptSchema,
});


// 🧩 MEMORY

export const createAIMemorySchema = z.object({
    gameType: z.literal(AIGameType.MEMORY),

    difficulty: aiGameDifficultySchema,

    pairCount: z
    .number()
    .int()
    .min(4, 'At least 4 pairs are required')
    .max(10, 'Maximum 10 pairs are allowed'),

    prompt: promptSchema,
});


// 🎨 SORTING

export const createAISortingSchema = z.object({
    gameType: z.literal(AIGameType.SORTING),

    difficulty: aiGameDifficultySchema,

    categoryCount: z
    .number()
    .int()
    .min(2, 'At least 2 categories are required')
    .max(4, 'Maximum 4 categories are allowed'),

    prompt: promptSchema,
});


// ⭐ CATCH

export const createAICatchSchema = z.object({
    gameType: z.literal(AIGameType.CATCH),

    difficulty: aiGameDifficultySchema,

    objectTypeCount: z
    .number()
    .int()
    .min(1, 'At least 1 object type is required')
    .max(5, 'Maximum 5 object types are allowed'),

    prompt: promptSchema,
});


// 🎮 ALL AI GAME REQUESTS

export const createAIGameSchema = z.discriminatedUnion('gameType', [
    createAIQuizSchema,
    createAITypingSchema,
    createAIMemorySchema,
    createAISortingSchema,
    createAICatchSchema,
]);

export type CreateAIGameInput = z.infer<typeof createAIGameSchema>;