import z from 'zod';

export const gameIdSchema = z.object({
    gameId: z.string().min(1)
});