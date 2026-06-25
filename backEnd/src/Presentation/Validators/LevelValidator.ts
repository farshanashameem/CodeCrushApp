import z from "zod";

const difficultyEnum = z.enum([
  "easy",
  "medium",
  "hard",
]);

 export const levelIdSchema = z.object({
    levelId: z.string().min(1)
});

export const gameIdSchema = z.object({
    gameId: z.string().min(1)
});

const mouseTrackerConfigSchema = z.object({
  pathWidth: z
    .number()
    .positive(),

  pathCoordinates: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
      })
    )
    .min(1),
});

const colorSorterConfigSchema = z.object({
  targetColors: z
    .array(z.string())
    .min(1),

  items: z
    .array(
      z.object({
        iconId: z.string(),
        color: z.string(),
        count: z.number().positive(),
      })
    )
    .min(1),
});

const typingConfigSchema = z.object({
  words: z
    .array(z.string())
    .min(1),
});

const picturePuzzleConfigSchema = z.object({
  steps: z
    .array(
      z.object({
        imageId: z.string(),
        answer: z.string().trim().min(1),
      })
    )
    .min(1),
});

const levelConfigSchema = z.union([
  mouseTrackerConfigSchema,
  colorSorterConfigSchema,
  typingConfigSchema,
  picturePuzzleConfigSchema,
]);

export const addLevelSchema = z.object({
  gameId: z
    .string()
    .trim()
    .min(1, "Game ID is required"),

  levelNumber: z
    .coerce.number()
    .int()
    .positive(),

  difficulty: difficultyEnum,

  timer: z
    .number()
    .positive(),

  maxScore: z
    .number()
    .positive(),

  config: levelConfigSchema,
});


export const updateLevelSchema = z .object({

    levelNumber: z
      .number()
      .int()
      .positive()
      .optional(),

    difficulty: difficultyEnum.optional(),

    timer: z
      .number()
      .positive()
      .optional(),

    maxScore: z
      .number()
      .positive()
      .optional(),

    config: levelConfigSchema.optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      data.levelNumber !== undefined ||
      data.difficulty !== undefined ||
      data.timer !== undefined ||
      data.maxScore !== undefined ||
      data.config !== undefined ||
      data.isActive !== undefined,
    {
      message: "At least one field must be provided",
    }
  );