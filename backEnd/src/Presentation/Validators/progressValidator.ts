import z from "zod";

export const getGameProgressSchema = z.object({
  childId: z
    .string()
    .trim()
    .min(1, "Child id is required"),

  gameId: z
    .string()
    .trim()
    .min(1, "Game id is required"),
});

export type GetGameProgressSchema =
  z.infer<typeof getGameProgressSchema>;


  export const submitLevelSchema = z.object({
  childId: z
    .string()
    .trim()
    .min(1, "Child id is required"),

  gameId: z
    .string()
    .trim()
    .min(1, "Game id is required"),

  levelId: z
    .string()
    .trim()
    .min(1, "Level id is required"),

  levelNumber: z.number(),
  completed: z.boolean(),

  score: z
    .number()
    .min(0),

  stars: z
    .number()
    .min(0)
    .max(3),

  timeTaken: z
    .number()
    .min(0),

  mistakes: z
    .number()
    .min(0),
});

export type SubmitLevelSchema =
  z.infer<typeof submitLevelSchema>;