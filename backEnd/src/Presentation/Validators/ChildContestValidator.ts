import z from 'zod';

/**
 * Schema for child ID
 */
export const childIdSchema = z.object({
    childId: z
        .string()
        .trim()
        .min(1, 'Child ID is required'),
});


/**
 * Schema for contest ID
 */
export const contestIdSchema = z.object({
    contestId: z
        .string()
        .trim()
        .min(1, 'Contest ID is required'),
});


/**
 * Schema for contest and child IDs
 */
export const childContestParamsSchema = z.object({
    childId: z
        .string()
        .trim()
        .min(1, 'Child ID is required'),

    contestId: z
        .string()
        .trim()
        .min(1, 'Contest ID is required'),
});


/**
 * Schema for updating contest progress
 *
 * The values represent the progress earned
 * from the current level/game.
 */
export const contestProgressSchema = z.object({
    score: z
        .number()
        .int('Score must be an integer')
        .min(0, 'Score cannot be negative'),

    stars: z
        .number()
        .int('Stars must be an integer')
        .min(0, 'Stars cannot be negative'),

    levelsCompleted: z
        .number()
        .int('Completed levels must be an integer')
        .min(0, 'Completed levels cannot be negative'),
});