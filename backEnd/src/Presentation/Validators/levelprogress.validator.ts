import z from 'zod';

export const getLevelProgressSchema = z.object({
  gameId: z.string().min(1),
  levelId: z.string().min(1),
});