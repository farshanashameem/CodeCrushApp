import z from 'zod';

/**
 * Schema for creating or updating a game review
 */
export const createGameReviewSchema = z.object({

    // ==========================================================
    // CHILD
    // ==========================================================

    childId: z
        .string()
        .trim()
        .min(1, 'Child ID is required'),

    // ==========================================================
    // GAME
    // ==========================================================

    gameId: z
        .string()
        .trim()
        .min(1, 'Game ID is required'),

    // ==========================================================
    // RATING
    // ==========================================================

    rating: z
        .number()
        .int('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),

    // ==========================================================
    // REVIEW
    // ==========================================================

    review: z
        .string()
        .trim()
        .max(500, 'Review must be at most 500 characters')
        .optional(),
});


/**
 * Schema for getting a specific child's review for a game
 */
export const getGameReviewSchema = z.object({

    // ==========================================================
    // CHILD
    // ==========================================================

    childId: z
        .string()
        .trim()
        .min(1, 'Child ID is required'),

    // ==========================================================
    // GAME
    // ==========================================================

    gameId: z
        .string()
        .trim()
        .min(1, 'Game ID is required'),
});


/**
 * Schema for getting all reviews for a game
 */
export const getGameReviewsSchema = z.object({

    // ==========================================================
    // GAME
    // ==========================================================

    gameId: z
        .string()
        .trim()
        .min(1, 'Game ID is required'),
});